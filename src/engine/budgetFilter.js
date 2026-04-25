export const getBudgetTier = (amount) => {
  if (amount < 500) return 'low';
  if (amount < 1500) return 'medium';
  return 'high';
};

export const filterPlacesByBudget = (places, tier) => {
  const maxCosts = { 'low': 500, 'medium': 1500, 'high': Infinity };
  return places.filter(p => p.entry_cost_inr <= maxCosts[tier]);
};
