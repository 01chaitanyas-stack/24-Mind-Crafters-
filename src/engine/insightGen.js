export const generateInsight = (places) => {
  if (places.length === 0) return "No places selected.";
  
  let hasTemple = false;
  let hasVineyard = false;
  let hasNature = false;
  
  places.forEach(p => {
    if (p.category === 'temple') hasTemple = true;
    if (p.category === 'vineyard') hasVineyard = true;
    if (p.category === 'nature' || p.category === 'fort') hasNature = true;
  });
  
  if (hasTemple && hasVineyard) return "A balanced mix of spiritual calmness and vineyard relaxation.";
  if (hasTemple && !hasVineyard) return "A spiritual journey focusing on ancient temples.";
  if (hasVineyard && !hasTemple) return "A relaxed wine tasting experience through the vineyards.";
  if (hasNature) return "An adventurous trip close to nature.";
  
  return "A wonderful customized itinerary for your trip.";
};
