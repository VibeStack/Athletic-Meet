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
      className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
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
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-linear-to-br ${gradient || "from-cyan-500 to-blue-600"}`}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={`text-xs font-medium uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {label}
          </p>
          <p
            className={`text-3xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {value?.toLocaleString() ?? "—"}
          </p>
          {hint && (
            <p
              className={`text-xs ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {hint}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`p-3 rounded-xl ${
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
