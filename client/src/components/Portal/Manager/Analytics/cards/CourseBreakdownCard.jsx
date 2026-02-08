import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from "react-responsive";

const COURSE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#f43f5e",
  "#84cc16",
  "#6366f1",
];

export default function CourseBreakdownCard({ data, darkMode }) {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const chartData =
    data
      ?.filter((d) => d._id)
      .map((d, i) => ({
        name: d._id,
        value: d.count,
        color: COURSE_COLORS[i % COURSE_COLORS.length],
      })) || [];

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-slate-900/80 border border-slate-800/50"
          : "bg-white border border-slate-200/50 shadow-lg"
      }`}
    >
      {/* HEADER */}
      <div className="mb-4 min-h-[88px] flex items-start justify-between">
        <div>
          <h3
            className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Participants by Course
          </h3>
          <p
            className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            {total.toLocaleString()} registered users
          </p>
        </div>
        <div className="h-[40px] w-[224px]" />
      </div>

      {/* CHART */}
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout={isMobile ? "vertical" : "horizontal"}
            barSize={isMobile ? 9 : 36}
            margin={
              isMobile
                ? { top: 10, right: 16, left: 0, bottom: 10 }
                : { top: 10, right: 16, left: 0, bottom: 10 }
            }
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#334155" : "#e2e8f0"}
              vertical={!isMobile}
              horizontal={isMobile}
            />

            {isMobile ? (
              <>
                <XAxis
                  type="number"
                  tick={{
                    fill: darkMode ? "#94a3b8" : "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={60}
                  tick={{
                    fill: darkMode ? "#94a3b8" : "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={{
                    fill: darkMode ? "#94a3b8" : "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: darkMode ? "#94a3b8" : "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
                  width={48}
                />
              </>
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              }}
              itemStyle={{ color: darkMode ? "#f1f5f9" : "#1e293b" }}
              formatter={(value) => [
                `${value} (${((value / total) * 100).toFixed(1)}%)`,
                "Participants",
              ]}
            />

            <Bar
              dataKey="value"
              radius={isMobile ? [0, 8, 8, 0] : [8, 8, 0, 0]}
              fill="#8b5cf6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
