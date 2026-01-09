export default function Card({ title, subtitle, right, className = "", children }) {
  return (
    <section className={`bg-slate-900 rounded-2xl p-5 border border-slate-800 ${className}`}>
      {(title || right) && (
        <header className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}
