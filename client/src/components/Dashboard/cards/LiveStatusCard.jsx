import Card from "../ui/Card";

export default function LiveStatusCard({ status }) {
  const Dot = <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />;

  const MegaphoneIcon = (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v4m0 0a4 4 0 108 0v-1l9-4v6l-9-4v3" />
    </svg>
  );

  return (
    <Card title="Live Meet Status" subtitle="Admin-only monitor">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
          <p className="text-xs text-slate-400">Meet</p>
          <p className="mt-1 text-slate-100 font-medium">{status.meetTitle}</p>
          <p className="text-slate-400 text-sm">Events Today: {status.eventsToday}</p>
        </div>

        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
          <p className="text-xs text-slate-400">Running</p>
          <p className="mt-1 text-slate-100 font-medium">{status.runningEvent || "—"}</p>
          <p className="text-slate-400 text-sm">Ground: {status.ground || "—"}</p>
        </div>

        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
          <p className="text-xs text-slate-400">Next</p>
          <p className="mt-1 text-slate-100 font-medium">{status.nextEvent || "—"}</p>
          <p className="text-slate-400 text-sm">ETA: {status.nextEta || "—"}</p>
        </div>
      </div>

      {status.alert && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
          {MegaphoneIcon}
          <span className="inline-flex items-center gap-2">{Dot}<span>{status.alert}</span></span>
        </div>
      )}
    </Card>
  );
}
