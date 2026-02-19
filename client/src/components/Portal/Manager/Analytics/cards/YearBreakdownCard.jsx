const YEAR_COLORS = {
  "1st Year": "#10b981",
  "2nd Year": "#3b82f6",
  "3rd Year": "#8b5cf6",
  "4th Year": "#f59e0b",
};

export default function YearBreakdownCard({ data, darkMode }) {
  const chartData =
    data
      ?.filter((d) => d._id)
      .sort((a, b) => {
        const order = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
        return order.indexOf(a._id) - order.indexOf(b._id);
      }) || [];

  const total = chartData.reduce((acc, d) => acc + d.count, 0);

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
        <h3
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Participants by Year
        </h3>
        <p
          className={`text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {total.toLocaleString()} registered users
        </p>
      </div>

      {/* PROGRESS LIST */}
      <div className="space-y-5">
        {chartData.map((d) => {
          const percentage = total ? (d.count / total) * 100 : 0;
          const color = YEAR_COLORS[d._id] || "#6b7280";

          return (
            <div key={d._id}>
              <div className="flex justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {d._id}
                </span>
                <span
                  className={`text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {d.count.toLocaleString()} ({percentage.toFixed(1)}%)
                </span>
              </div>

              <div
                className={`h-4 rounded-full overflow-hidden ${
                  darkMode ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                <div
                  className="h-full rounded-full transition-transform "
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-700/30">
        {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => {
          const yearData = chartData.find((d) => d._id === year);
          return (
            <div key={year} className="text-center">
              <p
                className="text-xl font-bold"
                style={{ color: YEAR_COLORS[year] }}
              >
                {yearData?.count?.toLocaleString() || 0}
              </p>
              <p
                className={`text-xs ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {year.replace(" Year", "")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
