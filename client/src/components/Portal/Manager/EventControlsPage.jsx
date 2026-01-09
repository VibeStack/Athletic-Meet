import { useState } from "react";

// Event data with lock status - organized better
const initialEvents = {
  "Day 1": {
    "Track Events": [
      {
        id: 1,
        name: "100m Sprint",
        emoji: "⚡",
        locked: false,
        participants: 65,
      },
      {
        id: 2,
        name: "200m Sprint",
        emoji: "🏃",
        locked: false,
        participants: 47,
      },
      {
        id: 3,
        name: "400m Race",
        emoji: "🏃‍♂️",
        locked: false,
        participants: 49,
      },
      {
        id: 4,
        name: "800m Race",
        emoji: "🏃‍♀️",
        locked: false,
        participants: 47,
      },
    ],
    "Field Events": [
      {
        id: 5,
        name: "Long Jump",
        emoji: "🦘",
        locked: false,
        participants: 52,
      },
      {
        id: 6,
        name: "High Jump",
        emoji: "🔝",
        locked: false,
        participants: 38,
      },
    ],
  },
  "Day 2": {
    "Track Events": [
      {
        id: 7,
        name: "1500m Race",
        emoji: "🎽",
        locked: false,
        participants: 23,
      },
      {
        id: 8,
        name: "5000m Race",
        emoji: "🏅",
        locked: false,
        participants: 49,
      },
    ],
    "Field Events": [
      {
        id: 9,
        name: "Triple Jump",
        emoji: "🥉",
        locked: false,
        participants: 41,
      },
      {
        id: 10,
        name: "Shot Put",
        emoji: "🏋️",
        locked: false,
        participants: 35,
      },
      {
        id: 11,
        name: "Discus Throw",
        emoji: "🥏",
        locked: false,
        participants: 29,
      },
      {
        id: 12,
        name: "Javelin Throw",
        emoji: "🎯",
        locked: false,
        participants: 33,
      },
    ],
  },
};

export default function EventControlsPage() {
  const [events, setEvents] = useState(initialEvents);
  const [updating, setUpdating] = useState(null);

  // Get all events flat for counting
  const getAllEvents = () => {
    const allEvents = [];
    Object.entries(events).forEach(([day, categories]) => {
      Object.entries(categories).forEach(([category, eventList]) => {
        eventList.forEach((event) =>
          allEvents.push({ ...event, day, category })
        );
      });
    });
    return allEvents;
  };

  const allEvents = getAllEvents();
  const lockedCount = allEvents.filter((e) => e.locked).length;
  const openCount = allEvents.filter((e) => !e.locked).length;

  const toggleEventLock = async (day, category, eventId) => {
    setUpdating(eventId);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setEvents((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [category]: prev[day][category].map((e) =>
          e.id === eventId ? { ...e, locked: !e.locked } : e
        ),
      },
    }));
    setUpdating(null);
  };

  const lockAllDay = async (day) => {
    const dayEvents = getAllEvents().filter((e) => e.day === day);
    const allLocked = dayEvents.every((e) => e.locked);

    setUpdating(`day-${day}`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setEvents((prev) => ({
      ...prev,
      [day]: Object.fromEntries(
        Object.entries(prev[day]).map(([cat, eventList]) => [
          cat,
          eventList.map((e) => ({ ...e, locked: !allLocked })),
        ])
      ),
    }));
    setUpdating(null);
  };

  const lockAllCategory = async (day, category) => {
    const categoryEvents = events[day][category];
    const allLocked = categoryEvents.every((e) => e.locked);

    setUpdating(`${day}-${category}`);
    await new Promise((resolve) => setTimeout(resolve, 400));

    setEvents((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [category]: prev[day][category].map((e) => ({
          ...e,
          locked: !allLocked,
        })),
      },
    }));
    setUpdating(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Event Controls
          </h1>
          <p className="text-gray-500 mt-1">
            Lock and unlock events to control enrollment
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
            <span className="text-green-700 font-bold">{openCount}</span>
            <span className="text-green-600 text-sm">Open</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl border border-red-200">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            <span className="text-red-700 font-bold">{lockedCount}</span>
            <span className="text-red-600 text-sm">Locked</span>
          </div>
        </div>
      </div>

      {/* Day-wise Cards */}
      {Object.entries(events).map(([day, categories]) => {
        const dayEvents = getAllEvents().filter((e) => e.day === day);
        const dayLocked = dayEvents.every((e) => e.locked);
        const dayLockedCount = dayEvents.filter((e) => e.locked).length;

        return (
          <div
            key={day}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Day Header */}
            <div
              className={`p-5 border-b border-gray-100 ${
                dayLocked
                  ? "bg-red-50"
                  : "bg-linear-to-r from-cyan-50 to-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      dayLocked ? "bg-red-100" : "bg-white shadow-sm"
                    }`}
                  >
                    {day === "Day 1" ? "1️⃣" : "2️⃣"}
                  </div>
                  <div>
                    <h2 className="text-gray-900 font-bold text-xl">{day}</h2>
                    <p className="text-gray-500 text-sm">
                      {dayEvents.length} events • {dayLockedCount} locked
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => lockAllDay(day)}
                  disabled={updating === `day-${day}`}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
                    dayLocked
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  } disabled:opacity-50`}
                >
                  {updating === `day-${day}` ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : dayLocked ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  )}
                  {dayLocked ? "Unlock All" : "Lock All"}
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="p-5 space-y-6">
              {Object.entries(categories).map(([category, eventList]) => {
                const categoryLocked = eventList.every((e) => e.locked);

                return (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {category === "Track Events" ? "🏃" : "🥏"}
                        </span>
                        <h3 className="text-gray-800 font-semibold">
                          {category}
                        </h3>
                        <span className="text-gray-400 text-sm">
                          ({eventList.length})
                        </span>
                      </div>
                      <button
                        onClick={() => lockAllCategory(day, category)}
                        disabled={updating === `${day}-${category}`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          categoryLocked
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } disabled:opacity-50`}
                      >
                        {updating === `${day}-${category}`
                          ? "..."
                          : categoryLocked
                          ? "Unlock"
                          : "Lock"}{" "}
                        Category
                      </button>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {eventList.map((event) => (
                        <div
                          key={event.id}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            event.locked
                              ? "bg-red-50 border-red-200"
                              : "bg-white border-gray-200 hover:border-cyan-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{event.emoji}</span>
                              <div>
                                <h4 className="text-gray-900 font-medium text-sm">
                                  {event.name}
                                </h4>
                                <p className="text-gray-400 text-xs">
                                  {event.participants} participants
                                </p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              toggleEventLock(day, category, event.id)
                            }
                            disabled={updating === event.id}
                            className={`w-full py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                              event.locked
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            } disabled:opacity-50`}
                          >
                            {updating === event.id ? (
                              <svg
                                className="w-4 h-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                              </svg>
                            ) : event.locked ? (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                                Locked
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                  />
                                </svg>
                                Open
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Info Box */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-blue-900 font-semibold mb-1">
            About Event Locking
          </h4>
          <p className="text-blue-700 text-sm">
            When an event is locked, students cannot enroll or unenroll from it.
            Use this to close enrollment after an event has been conducted. You
            can lock events individually, by category, or all events for an
            entire day.
          </p>
        </div>
      </div>
    </div>
  );
}
