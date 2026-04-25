import { filterPlacesByBudget } from './budgetFilter';
import { scorePlaces } from './scorer';
import { calculateTravel } from './travelTime';
import { generateInsight } from './insightGen';
import { haversine } from './haversine';

export const generateItinerary = async (params, data) => {
  const { startLocation, availableHours } = params;
  let { budgetTier } = params;

  const locationKeys = Object.keys(data.transport.locations || {});
  const originKey = locationKeys.find(
    k => k.toLowerCase() === startLocation.toLowerCase()
  );
  const originData = originKey ? data.transport.locations[originKey] : null;

  const startLoc = originData
    ? { name: originKey, lat: originData.lat, lng: originData.lng }
    : { name: 'Nashik City', lat: 19.9975, lng: 73.7898 };

  const distFromCityCentre = haversine(startLoc.lat, startLoc.lng, 19.9975, 73.7898);
  const isFarFromCentre = distFromCityCentre > 15;

  const getMaxPlaces = (hrs) => {
    if (hrs <= 2)  return 1;
    if (hrs <= 3)  return 2;
    if (hrs <= 5)  return 3;
    if (hrs <= 7)  return 4;
    if (hrs <= 10) return 5;
    return 6;
  };

  let maxPlaces = getMaxPlaces(availableHours);
  if (isFarFromCentre) maxPlaces = Math.max(1, maxPlaces - 1);

  const userBudget = params.budgetAmount || (budgetTier === 'low' ? 500 : budgetTier === 'medium' ? 1500 : 5000);

  // Fix 1 — Smart food budget reservation based on actual budget
  const getFoodBudget = (budget, tier) => {
    if (tier === 'low')    return Math.min(150, budget * 0.25);
    if (tier === 'medium') return Math.min(300, budget * 0.20);
    return Math.min(500, budget * 0.15);
  };

  const foodBudget = getFoodBudget(userBudget, budgetTier);
  const budgetForTrip = userBudget - foodBudget;

  // Fix 4 — Build prioritized candidate list
  let filtered = filterPlacesByBudget(data.places, budgetTier);
  let scored = scorePlaces(filtered, startLoc.lat, startLoc.lng);

  scored.sort((a, b) => {
    if (Math.abs((a.score || 0) - (b.score || 0)) < 0.5) {
      return (a.entry_cost_inr || 0) - (b.entry_cost_inr || 0);
    }
    return (b.score || 0) - (a.score || 0);
  });

  // Map scored places to the shape used by existing logic
  const toPlace = (p) => ({
    ...p,
    entryCost: p.entry_cost_inr || 0,
    priority:  p.score || 0,
  });

  const scoredPlaces = scored.map(toPlace);

  let candidates;
  if (budgetTier === 'low') {
    // Skip paid places above ₹100 entry cost when budget is low
    candidates = scoredPlaces.filter(p => (p.entryCost || 0) <= 100);
  } else {
    const paidHighValue  = scoredPlaces.filter(p => (p.entryCost || 0) > 0 && p.priority >= 8);
    const freeHighValue  = scoredPlaces.filter(p => (p.entryCost || 0) === 0 && p.priority >= 7);
    const lowPriority    = scoredPlaces.filter(p => p.priority < 7);

    // De-duplicate while preserving order
    candidates = [
      ...paidHighValue,
      ...freeHighValue,
      ...lowPriority,
    ].filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
  }

  // Helper: get travel cost between two locations
  const getTravelCost = async (from, to, tier) => {
    const dist = haversine(from.lat, from.lng, to.lat, to.lng);
    const result = await calculateTravel(dist, data.transport, tier, from.lat, from.lng, to.lat, to.lng);
    return { cost: result.cost, timeHrs: result.timeHrs, dist, mode: result.mode };
  };

  // Fix 2 — Greedy selection to FILL the budget
  let spentSoFar      = 0;
  let selectedPlaces  = [];
  let totalTime       = 0;
  let attractionTotal = 0;
  let transportTotal  = 0;
  let lastLocation    = startLoc;

  for (const place of candidates) {
    if (selectedPlaces.length >= maxPlaces) break;

    const travel = await getTravelCost(lastLocation, place, budgetTier);

    if (totalTime + travel.timeHrs + (place.visit_duration_hrs || 0) > availableHours) {
      continue;
    }

    const placeCost    = place.entryCost || 0;
    const totalIfAdded = spentSoFar + travel.cost + placeCost;

    if (totalIfAdded <= budgetForTrip) {
      spentSoFar      += travel.cost + placeCost;
      attractionTotal += placeCost;
      transportTotal  += travel.cost;
      totalTime       += travel.timeHrs + (place.visit_duration_hrs || 0);
      selectedPlaces.push({ ...place, travelTo: { ...travel } });
      lastLocation = place;
    }
  }

  // Try to add one more place from remaining candidates when >20% budget unused
  const budgetUsed = spentSoFar / budgetForTrip;
  if (budgetUsed < 0.8 && selectedPlaces.length < maxPlaces) {
    const usedIds         = new Set(selectedPlaces.map(p => p.id));
    const remainingCands  = candidates.filter(p => !usedIds.has(p.id));

    for (const place of remainingCands) {
      const travel    = await getTravelCost(lastLocation, place, budgetTier);
      const placeCost = place.entryCost || 0;

      if (
        totalTime + travel.timeHrs + (place.visit_duration_hrs || 0) <= availableHours &&
        spentSoFar + travel.cost + placeCost <= budgetForTrip
      ) {
        spentSoFar      += travel.cost + placeCost;
        attractionTotal += placeCost;
        transportTotal  += travel.cost;
        totalTime       += travel.timeHrs + (place.visit_duration_hrs || 0);
        selectedPlaces.push({ ...place, travelTo: { ...travel } });
        lastLocation = place;
        break;
      }
    }
  }

  // Fix 3 — Upgrade transport mode if budget allows
  const remainingBudget = budgetForTrip - spentSoFar;
  let upgradedTier = budgetTier;
  if (budgetTier === 'low' && remainingBudget > 200) {
    upgradedTier = 'medium';
  } else if (budgetTier === 'medium' && remainingBudget > 400) {
    upgradedTier = 'high';
  }

  if (upgradedTier !== budgetTier && selectedPlaces.length > 0) {
    // Recalculate transport costs with upgraded tier
    let newSpent        = 0;
    let newTransport    = 0;
    let newAttractions  = 0;
    let newTime         = 0;
    let recalcLoc       = startLoc;
    let recalcValid     = true;

    const recalcPlaces = [];
    for (const place of selectedPlaces) {
      const travel    = await getTravelCost(recalcLoc, place, upgradedTier);
      const placeCost = place.entryCost || 0;
      const added     = newSpent + travel.cost + placeCost;

      if (added > budgetForTrip) {
        // Upgrade makes it too expensive; abort upgrade
        recalcValid = false;
        break;
      }

      newSpent       += travel.cost + placeCost;
      newTransport   += travel.cost;
      newAttractions += placeCost;
      newTime        += travel.timeHrs + (place.visit_duration_hrs || 0);
      recalcPlaces.push({ ...place, travelTo: { ...travel } });
      recalcLoc = place;
    }

    if (recalcValid) {
      budgetTier      = upgradedTier;
      spentSoFar      = newSpent;
      transportTotal  = newTransport;
      attractionTotal = newAttractions;
      totalTime       = newTime;
      selectedPlaces  = recalcPlaces;
    }
  }

  // Fix 5 — Final hard cap guarantee
  while (
    selectedPlaces.length > 1 &&
    spentSoFar + foodBudget > userBudget
  ) {
    const removed = selectedPlaces.pop();
    const removedEntry  = removed.entryCost || 0;
    const removedTravel = removed.travelTo?.cost || 0;
    spentSoFar      -= removedEntry + removedTravel;
    attractionTotal -= removedEntry;
    transportTotal  -= removedTravel;
  }

  const grandTotal = Math.min(spentSoFar + foodBudget, userBudget);

  // Fix 6 — Utilization info
  const budgetUtilization = Math.round((grandTotal / userBudget) * 100);

  const insight = generateInsight(selectedPlaces);

  let hotels = [];
  if (availableHours > 6 || isFarFromCentre) {
    if (selectedPlaces.length > 0) {
      const zone = data.hotels.placeToZone[selectedPlaces[0].id] || 'centralTemples';
      hotels = data.hotels[zone]?.[budgetTier === 'low' ? 'budget' : budgetTier === 'medium' ? 'midrange' : 'premium']
        || data.hotels[zone]?.['budget']
        || [];
    }
  }

  const locationKey     = startLoc.name.toLowerCase();
  const foodDataForLoc  = data.food.byLocation[locationKey] || data.food.byLocation['default'];
  const foodSuggestions = foodDataForLoc[budgetTier] || [];

  // Remap selectedPlaces back to the shape the UI expects (travelTo object)
  const sequence = selectedPlaces.map(p => {
    const { entryCost, priority, ...rest } = p;
    return rest;
  });

  return {
    sequence,
    totalTime,
    totalCost:          Math.round(grandTotal),
    travelCost:         Math.round(transportTotal),
    foodTotal:          Math.round(foodBudget),
    insight,
    hotels,
    foodSuggestions,
    startLoc,
    budgetUtilization,
    costs: {
      attractions: Math.round(attractionTotal),
      transport:   Math.round(transportTotal),
      food:        Math.round(foodBudget),
      grandTotal:  Math.round(grandTotal),
      userBudget,
      remaining:   Math.round(userBudget - grandTotal),
    },
  };
};
