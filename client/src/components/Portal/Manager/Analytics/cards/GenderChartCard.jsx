import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = {
  Male: "#3b82f6",
  Female: "#ec4899",
};

export default function GenderChartCard({ data, darkMode }) {
  const chartData =
    data
      ?.filter((d) => d._id)
      .map((d) => ({
        name: d._id,
        value: d.count,
      })) || [];

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

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
          Gender Distribution
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
        Gender Distribution
      </h3>
      <p
        className={`text-sm mb-4 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {total.toLocaleString()} total participants
      </p>

      <div className="h-64">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
        >
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
                <Cell key={entry.name} fill={COLORS[entry.name] || "#6b7280"} />
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

      {/* Stats below chart */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/30">
        {chartData.map((d) => (
          <div key={d.name} className="text-center">
            <p
              className="text-2xl font-bold"
              style={{ color: COLORS[d.name] || "#6b7280" }}
            >
              {d.value.toLocaleString()}
            </p>
            <p
              className={`text-xs ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {d.name} ({((d.value / total) * 100).toFixed(1)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
