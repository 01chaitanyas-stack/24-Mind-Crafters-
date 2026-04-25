export const calculateTravel = async (dist, transportData, budgetTier, lat1, lng1, lat2, lng2) => {
  const options = transportData.byBudgetTier[budgetTier] || ['rickshaw'];
  const mode = options[0];

  const speed = transportData.speeds[mode]?.avgSpeed || 20;
  const costConfig = transportData.costs[mode];

  let distanceKm = dist;
  let timeHrs = dist / speed;

  if (lat1 !== undefined && lng1 !== undefined && lat2 !== undefined && lng2 !== undefined) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`, { signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          distanceKm = data.routes[0].distance / 1000;
          timeHrs = data.routes[0].duration / 3600;

          if (mode === 'bus') timeHrs *= 1.4;
          else if (mode === 'auto' || mode === 'rickshaw') timeHrs *= 1.2;
          else if (mode === 'cab') timeHrs *= 1.1;
          else if (mode === 'bike') timeHrs *= 1.0;
        }
      }
    } catch (e) {
    }
  }

  const cost = costConfig ? costConfig.base + (distanceKm * costConfig.perKm) : distanceKm * 10;

  return { mode, timeHrs, cost: Math.round(cost), distanceKm };
};
