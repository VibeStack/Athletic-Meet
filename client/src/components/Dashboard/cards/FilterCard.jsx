import Card from "../ui/Card";

export default function FilterCard({
  genderFilter,
  setGenderFilter,
  typeFilter,
  setTypeFilter,
  minParticipants,
  setMinParticipants
}) {
  return (
    <Card title="Filters" subtitle="Refine analytics without clutter">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-slate-400">Gender</label>
          <div className="mt-1 grid grid-cols-4 gap-2">
            {["all", "boys", "girls", "mixed"].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-2 rounded-xl text-sm border ${
                  genderFilter === g ? "bg-slate-800 border-slate-700" : "border-slate-800 hover:bg-slate-900"
                }`}
              >
                {g[0].toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400">Event Type</label>
          <div className="mt-1 grid grid-cols-5 gap-2">
            {["all", "Track", "Field", "Relay", "Fun"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-xl text-sm border ${
                  typeFilter === t ? "bg-slate-800 border-slate-700" : "border-slate-800 hover:bg-slate-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400">Min Participants (per event)</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              min={0}
              max={50}
              value={minParticipants}
              onChange={(e) => setMinParticipants(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm w-10 text-right">{minParticipants}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
