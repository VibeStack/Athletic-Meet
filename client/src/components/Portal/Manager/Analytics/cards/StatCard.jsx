export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  gradient,
  darkMode,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        darkMode
          ? "bg-slate-900/80 border border-slate-800/50"
          : "bg-white border border-slate-200/50 shadow-lg"
      }`}
    >
      {/* Gradient accent */}
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${gradient || "from-cyan-500 to-blue-600"}`}
      />

      {/* Background glow */}
      <div
        className={`absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-3xl opacity-20 bg-linear-to-br ${gradient || "from-cyan-500 to-blue-600"}`}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between sm:block">
            <p
              className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {label}
            </p>
            {/* Icon - inline on mobile, separate on desktop */}
            {Icon && (
              <div
                className={`sm:hidden p-2 rounded-lg ${
                  darkMode ? "bg-slate-800/80" : "bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                />
              </div>
            )}
          </div>
          <p
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {value?.toLocaleString() ?? "—"}
          </p>
          {hint && (
            <p
              className={`text-[10px] sm:text-xs ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {hint}
            </p>
          )}
        </div>

        {/* Icon - hidden on mobile, visible on desktop */}
        {Icon && (
          <div
            className={`hidden sm:block p-3 rounded-xl ${
              darkMode ? "bg-slate-800/80" : "bg-slate-100"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
