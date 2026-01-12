import React from "react";

/* -------------------- SVG Icons -------------------- */
const ICONS = {
  trophy: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  ),
};

export default function UserDetailEvents({
  userData,
  darkMode,
  openAddEventModal,
  markAttendance,
  getStatusDisplay,
}) {
  return (
    <section
      className={`lg:col-span-7 rounded-2xl overflow-hidden ${
        darkMode
          ? "bg-slate-900/80 border border-white/10"
          : "bg-white border border-slate-200 shadow-lg"
      }`}
    >
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          darkMode ? "border-white/5" : "border-slate-100"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
              darkMode
                ? "bg-linear-to-br from-orange-500 to-amber-600"
                : "bg-slate-800"
            }`}
          >
            {ICONS.trophy}
          </div>
          <h2
            className={`font-bold text-sm ${
              darkMode ? "text-white" : "text-slate-800"
            }`}
          >
            Registered Events
          </h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-bold ${
              darkMode
                ? "bg-slate-700 text-slate-300"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {userData.selectedEvents?.length || 0}
          </span>
        </div>

        <button
          onClick={openAddEventModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            darkMode
              ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          {ICONS.plus}
          Add Event
        </button>
      </div>

      <div className="p-3">
        {userData.selectedEvents?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userData.selectedEvents.map(
              ({ eventId, eventName, eventType, attendanceStatus }) => {
                const status = getStatusDisplay(attendanceStatus);
                return (
                  <div
                    key={eventId}
                    className={`rounded-xl p-4 transition-all ${
                      darkMode
                        ? "bg-slate-800/70 border border-white/5 hover:border-white/10"
                        : "bg-slate-50 border border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className={`font-bold text-sm leading-tight ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {eventName}
                      </h3>
                    </div>

                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        eventType === "Track"
                          ? darkMode
                            ? "bg-orange-500/25 text-orange-400"
                            : "bg-orange-100 text-orange-600"
                          : eventType === "Field"
                          ? darkMode
                            ? "bg-emerald-500/25 text-emerald-400"
                            : "bg-emerald-100 text-emerald-600"
                          : darkMode
                          ? "bg-blue-500/25 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {eventType}
                    </span>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => markAttendance(eventId, "present")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          attendanceStatus === "present"
                            ? "bg-emerald-500 text-white"
                            : darkMode
                            ? "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/70"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(eventId, "absent")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          attendanceStatus === "absent"
                            ? "bg-red-500 text-white"
                            : darkMode
                            ? "bg-red-900/50 text-red-400 hover:bg-red-900/70"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => markAttendance(eventId, "notMarked")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          attendanceStatus === "notMarked"
                            ? "bg-amber-500 text-white"
                            : darkMode
                            ? "bg-amber-900/50 text-amber-400 hover:bg-amber-900/70"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        Not Marked
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div
            className={`text-center py-16 ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <div
              className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                darkMode ? "bg-slate-800" : "bg-slate-100"
              }`}
            >
              {ICONS.trophy}
            </div>
            <p className="text-sm font-semibold">No events registered</p>
            <p className="text-xs mt-1">Click "Add Event" to register.</p>
          </div>
        )}
      </div>
    </section>
  );
}
