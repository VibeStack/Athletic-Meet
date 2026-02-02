import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const STATUS_COLORS = {
  present: "#10b981",
  absent: "#ef4444",
  notMarked: "#f59e0b",
};

const STATUS_LABELS = {
  present: "Present",
  absent: "Absent",
  notMarked: "Not Marked",
};

// Chevron icon for select
const ChevronIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default function AttendanceChartCard({
  data,
  eventWiseAttendance,
  darkMode,
}) {
  const [selectedEvent, setSelectedEvent] = useState("");

  // Get attendance data based on selected event
  const getAttendanceData = () => {
    if (!selectedEvent || selectedEvent === "") {
      // Overall attendance
      return (
        data
          ?.filter((d) => d._id)
          .map((d) => ({
            name: STATUS_LABELS[d._id] || d._id,
            value: d.count,
            key: d._id,
          })) || []
      );
    } else {
      // Event-specific attendance
      const event = eventWiseAttendance?.find((e) => e._id === selectedEvent);
      if (!event) return [];
      return [
        { name: "Present", value: event.present || 0, key: "present" },
        { name: "Absent", value: event.absent || 0, key: "absent" },
        { name: "Not Marked", value: event.notMarked || 0, key: "notMarked" },
      ].filter((d) => d.value > 0);
    }
  };

  const chartData = getAttendanceData();
  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  if (!data && !eventWiseAttendance) {
    return (
      <div
        className={`rounded-2xl p-4 sm:p-6 ${
          darkMode
            ? "bg-slate-900/80 border border-slate-800/50"
            : "bg-white border border-slate-200/50 shadow-lg"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Attendance Status
        </h3>
        <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
          No data available
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-4 sm:p-6 ${
        darkMode
          ? "bg-slate-900/80 border border-slate-800/50"
          : "bg-white border border-slate-200/50 shadow-lg"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Attendance Status
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {total.toLocaleString()}{" "}
            {selectedEvent ? "participants" : "total enrollments"}
          </p>
        </div>

        {/* Enhanced Event Select Dropdown */}
        {eventWiseAttendance && eventWiseAttendance.length > 0 && (
          <div className="relative">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className={`appearance-none w-full sm:w-56 px-4 py-2.5 pr-10 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${
                darkMode
                  ? "bg-slate-800/80 border-slate-700 text-white hover:border-slate-600 focus:border-cyan-500"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-cyan-500"
              } focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm`}
            >
              <option value="">All Events</option>
              {eventWiseAttendance.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name} ({event.category})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronIcon />
            </div>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
            No attendance data for this event
          </p>
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.key] || "#f59e0b"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  }}
                  itemStyle={{
                    color: darkMode ? "#f1f5f9" : "#1e293b",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span
                      style={{
                        color: darkMode ? "#94a3b8" : "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats below chart - with better gap */}
          <div
            className={`flex justify-around items-center gap-6 mt-6 pt-5 border-t ${
              darkMode ? "border-slate-700/50" : "border-slate-200"
            }`}
          >
            {chartData.map((d) => (
              <div key={d.name} className="text-center px-2">
                <p
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: STATUS_COLORS[d.key] || "#f59e0b" }}
                >
                  {d.value.toLocaleString()}
                </p>
                <p
                  className={`text-xs sm:text-sm mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {d.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
