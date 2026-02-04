import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const chartData =
    data
      ?.filter((d) => d._id)
      .map((d, i) => ({
        name: d._id,
        value: d.count,
        color: COURSE_COLORS[i % COURSE_COLORS.length],
      })) || [];

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  if (chartData.length === 0) {
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
          Participants by Course
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
      <h3
        className={`text-lg font-semibold mb-2 ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        Participants by Course
      </h3>
      <p
        className={`text-sm mb-6 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {total.toLocaleString()} registered users
      </p>

      {/* Increased height and adjusted for better label spacing */}
      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
        >
          <BarChart
            data={chartData}
            barCategoryGap="15%"
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#334155" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 10 }}
              axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
              angle={-55}
              textAnchor="end"
              height={100}
              interval={0}
              dy={5}
            />
            <YAxis
              tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 12 }}
              axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
              width={45}
            />
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
              formatter={(value, name, props) => [
                `${value} (${((value / total) * 100).toFixed(1)}%)`,
                "Participants",
              ]}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              fill="url(#courseGradient)"
            />
            <defs>
              <linearGradient id="courseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
