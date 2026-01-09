import Card from "../ui/Card";

export default function QuickActionsCard() {
  const PlusIcon = (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
  const UploadIcon = (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v4h16v-4" />
    </svg>
  );

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-2 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-slate-900 text-sm font-semibold inline-flex items-center gap-2">
          {PlusIcon} Add Event
        </button>
        <button className="px-3 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-sm inline-flex items-center gap-2">
          {PlusIcon} Add Participant
        </button>
        <button className="px-3 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-sm inline-flex items-center gap-2">
          {UploadIcon} Import CSV
        </button>
      </div>
    </Card>
  );
}
