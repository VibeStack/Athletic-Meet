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
import { useMediaQuery } from "react-responsive";

const TYPE_COLORS = {
  Track: "#10b981",
  Field: "#f59e0b",
  Team: "#8b5cf6",
};

export default function EventTypeChartCard({ data, darkMode }) {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const chartData =
    data?.filter((d) => d._id).map((d) => ({
      name: d._id,
      value: d.count,
    })) || [];

  return (
    <div
      className={`rounded-2xl p-6 ${
        darkMode
          ? "bg-slate-900/80 border border-slate-800/50"
          : "bg-white border border-slate-200/50 shadow-lg"
      }`}
    >
      {/* HEADER */}
      <div className="mb-4 min-h-[88px]">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
          Events by Type
        </h3>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Distribution of event types
        </p>
      </div>

      {/* CHART */}
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            barSize={isMobile ? 9 : 36}
            margin={{
              top: 10,
              right: 10,
              left: isMobile ? 0 : 32,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#334155" : "#e2e8f0"}
              horizontal={false}
            />

            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 12 }}
              axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={isMobile ? 60 : 10}
              tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: isMobile ? 12 : 14 }}
              axisLine={{ stroke: darkMode ? "#475569" : "#cbd5e1" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              }}
              itemStyle={{ color: darkMode ? "#f1f5f9" : "#1e293b" }}
              formatter={(value) => [`${value} events`, "Count"]}
            />

            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || "#6b7280"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
