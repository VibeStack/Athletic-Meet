const POSITION_COLORS = {
  1: "#fbbf24", // Gold
  2: "#94a3b8", // Silver
  3: "#cd7f32", // Bronze
};

const POSITION_LABELS = {
  1: "1st Place",
  2: "2nd Place",
  3: "3rd Place",
};

const TrophyIcon = ({ color }) => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill={color}>
    <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
  </svg>
);

export default function WinnersCard({ data, darkMode }) {
  const sortedData =
    data
      ?.filter((d) => d._id >= 1 && d._id <= 3)
      .sort((a, b) => a._id - b._id) || [];

  const totalWinners = sortedData.reduce((acc, d) => acc + d.count, 0);

  if (sortedData.length === 0) {
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
          Winners & Positions
        </h3>
        <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
          No winners data yet
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Winners & Positions
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {totalWinners.toLocaleString()} total winners
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((position) => {
          const posData = sortedData.find((d) => d._id === position);
          const count = posData?.count || 0;

          return (
            <div
              key={position}
              className={`relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 ${
                darkMode
                  ? "bg-slate-800/50 border border-slate-700/50"
                  : "bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200"
              }`}
            >
              {/* Shine effect for 1st place */}
              {position === 1 && (
                <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 to-transparent" />
              )}

              <div className="relative">
                <div className="flex justify-center mb-2">
                  <TrophyIcon color={POSITION_COLORS[position]} />
                </div>
                <p
                  className="text-2xl font-bold"
                  style={{ color: POSITION_COLORS[position] }}
                >
                  {count.toLocaleString()}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {POSITION_LABELS[position]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
