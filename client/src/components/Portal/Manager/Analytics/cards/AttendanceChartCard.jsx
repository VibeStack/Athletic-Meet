import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { sortEvents } from "../../../../../utils/eventSort";
import { ChevronIcon } from "../../../../../icons/Portal/Manager/Analytics/AttendanceIcons";

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

export default function AttendanceChartCard({
  data,
  eventWiseAttendance,
  darkMode,
}) {
  const [selectedEvent, setSelectedEvent] = useState("");

  const getAttendanceData = () => {
    if (!selectedEvent) {
      return (
        data
          ?.filter((d) => d._id)
          .map((d) => ({
            name: STATUS_LABELS[d._id] || d._id,
            value: d.count,
            key: d._id,
          })) || []
      );
    }

    const event = eventWiseAttendance?.find((e) => e._id === selectedEvent);
    if (!event) return [];

    return [
      { name: "Present", value: event.present || 0, key: "present" },
      { name: "Absent", value: event.absent || 0, key: "absent" },
      { name: "Not Marked", value: event.notMarked || 0, key: "notMarked" },
    ].filter((d) => d.value > 0);
  };

  const chartData = getAttendanceData();
  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-slate-900/80 border border-slate-800/50"
          : "bg-white border border-slate-200/50 shadow-lg"
      }`}
    >
      {/* ================= HEADER (FIXED HEIGHT) ================= */}
      <div className="mb-4 min-h-[88px] flex items-start justify-between">
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

        {/* Right Slot (reserved space) */}
        <div className="h-[40px] w-[224px]">
          {eventWiseAttendance?.length > 0 && (
            <div className="relative">
              <select
                id="attendance-event-select"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className={`appearance-none w-full px-4 py-2.5 pr-10 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${
                  darkMode
                    ? "bg-slate-800/80 border-slate-700 text-white hover:border-slate-600 focus:border-cyan-500"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-cyan-500"
                } focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm`}
              >
                <option value="">All Events</option>
                {sortEvents(eventWiseAttendance).map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.name} ({event.category})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronIcon />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CHART (FIXED HEIGHT) ================= */}
      {chartData.length === 0 ? (
        <div className="h-[260px] flex flex-col items-center justify-center text-center px-6">
          <div
            className={`mb-3 text-sm font-medium ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            No attendance recorded
          </div>

          <p
            className={`text-xs sm:text-sm max-w-xs ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Attendance for this event has not been marked yet. Once attendance
            is taken, details will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="h-[260px] flex items-center justify-center">
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
                      key={entry.key}
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
                  height={40}
                  align="center"
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

          {/* ================= STATS (FIXED HEIGHT) ================= */}
          <div className="mt-4 pt-4 border-t border-slate-700/30 min-h-[96px]">
            <div className={`grid grid-cols-${chartData.length} gap-4`}>
              {chartData.map((d) => (
                <div key={d.key} className="text-center">
                  <p
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: STATUS_COLORS[d.key] }}
                  >
                    {d.value}
                  </p>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {d.name} ({((d.value / total) * 100).toFixed(1)}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
