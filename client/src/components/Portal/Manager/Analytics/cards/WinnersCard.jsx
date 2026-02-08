const POSITION_COLORS = {
  1: "#fbbf24",
  2: "#94a3b8",
  3: "#cd7f32",
};

const POSITION_LABELS = {
  1: "1st Place",
  2: "2nd Place",
  3: "3rd Place",
};

import { TrophyIcon } from "../../../../../icons/Portal/Manager/Analytics/WinnersIcons";

export default function WinnersCard({ data, darkMode }) {
  const sortedData =
    data
      ?.filter((d) => d._id >= 1 && d._id <= 3)
      .sort((a, b) => a._id - b._id) || [];

  const totalWinners = sortedData.reduce((acc, d) => acc + d.count, 0);

  return (
    <div
      className={`rounded-2xl p-6 flex flex-col ${
        darkMode
          ? "bg-slate-900/80 border border-slate-800/50"
          : "bg-white border border-slate-200/50 shadow-lg"
      }`}
    >
      {/* HEADER */}
      <div className="mb-4">
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

      {/* CONTENT */}
      {sortedData.length === 0 ? (
        <div className="flex flex-col flex-1 items-center justify-center text-center px-6">
          <div
            className={`mb-2 text-sm font-medium ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            No winners declared
          </div>

          <p
            className={`text-xs sm:text-sm max-w-xs ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Winners will appear here once results are announced and positions
            are finalized.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap my-auto gap-4">
          {[1, 2, 3].map((position) => {
            const posData = sortedData.find((d) => d._id === position);
            const count = posData?.count || 0;

            return (
              <div
                key={position}
                className={`relative flex-1 min-w-[160px] rounded-xl p-5 text-center ${
                  darkMode
                    ? "bg-slate-800/60 border border-slate-700/50"
                    : "bg-slate-50 border border-slate-200"
                }`}
              >
                {/* Highlight 1st place */}
                {position === 1 && (
                  <div className="absolute inset-0 rounded-xl bg-yellow-500/5" />
                )}

                <div className="relative">
                  <div className="flex justify-center mb-3">
                    <TrophyIcon color={POSITION_COLORS[position]} />
                  </div>

                  <p
                    className="text-3xl font-bold"
                    style={{ color: POSITION_COLORS[position] }}
                  >
                    {count.toLocaleString()}
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${
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
      )}
    </div>
  );
}
