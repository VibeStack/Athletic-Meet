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
          Participants by Year
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
        Participants by Year
      </h3>
      <p
        className={`text-sm mb-6 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {total.toLocaleString()} registered users
      </p>

      <div className="space-y-4">
        {chartData.map((d) => {
          const percentage = total > 0 ? (d.count / total) * 100 : 0;
          const color = YEAR_COLORS[d._id] || "#6b7280";

          return (
            <div key={d._id}>
              <div className="flex items-center justify-between mb-2">
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
                className={`relative h-3 rounded-full overflow-hidden ${
                  darkMode ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-700/30">
        {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => {
          const yearData = chartData.find((d) => d._id === year);
          return (
            <div key={year} className="text-center">
              <p
                className="text-lg font-bold"
                style={{ color: YEAR_COLORS[year] }}
              >
                {yearData?.count?.toLocaleString() || 0}
              </p>
              <p
                className={`text-[10px] ${
                  darkMode ? "text-slate-500" : "text-slate-400"
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
