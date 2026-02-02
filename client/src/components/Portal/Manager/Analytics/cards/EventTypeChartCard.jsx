import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TYPE_COLORS = {
  Track: "#10b981",
  Field: "#f59e0b",
  Team: "#8b5cf6",
};

export default function EventTypeChartCard({ data, darkMode }) {
  const chartData =
    data
      ?.filter((d) => d._id)
      .map((d) => ({
        name: d._id,
        value: d.count,
      })) || [];

  if (chartData.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 ${
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
          Events by Type
        </h3>
        <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
          No data available
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-6 ${
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
        Events by Type
      </h3>
      <p
        className={`text-sm mb-4 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Distribution of event types
      </p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#334155" : "#e2e8f0"}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 12 }}
              axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={60}
              tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 12 }}
              axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
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
              formatter={(value) => [`${value} events`, "Count"]}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={TYPE_COLORS[entry.name] || "#6b7280"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-700/30">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: TYPE_COLORS[d.name] || "#6b7280" }}
            />
            <span
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {d.name}: {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
