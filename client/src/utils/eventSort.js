export const sortEvents = (events) => {
  if (!events || !Array.isArray(events)) return [];

  const dayPriority = {
    "Day 1": 1,
    "Day 2": 2,
    Both: 3,
    "Both Days": 3,
  };

  return [...events].sort((a, b) => {
    // 1. Sort by Day
    const dayA = dayPriority[a.day] || 99;
    const dayB = dayPriority[b.day] || 99;
    if (dayA !== dayB) return dayA - dayB;

    // 2. Sort by Name
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    if (nameA !== nameB) return nameA.localeCompare(nameB);

    // 3. Sort by Category (Boys then Girls)
    const catA = (a.category || "").toLowerCase();
    const catB = (b.category || "").toLowerCase();
    return catA.localeCompare(catB);
  });
};
