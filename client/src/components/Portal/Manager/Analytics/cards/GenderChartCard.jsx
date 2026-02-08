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
    data?.filter((d) => d._id).map((d) => ({
      name: d._id,
      value: d.count,
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
      {/* ================= HEADER (FIXED HEIGHT) ================= */}
      <div className="mb-4 min-h-[88px] flex items-start justify-between">
        <div>
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Gender Distribution
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {total.toLocaleString()} total participants
          </p>
        </div>

        {/* Right slot (kept empty for alignment with Attendance card) */}
        <div className="h-[40px] w-[224px]" />
      </div>

      {/* ================= CHART (FIXED HEIGHT) ================= */}
      {chartData.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center">
          <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
            No data available
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
                      key={entry.name}
                      fill={COLORS[entry.name] || "#6b7280"}
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
                <div key={d.name} className="text-center">
                  <p
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: COLORS[d.name] || "#6b7280" }}
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
