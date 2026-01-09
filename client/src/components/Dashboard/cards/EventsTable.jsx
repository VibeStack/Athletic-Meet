import Card from "../ui/Card";

export default function EventsTable({ events }) {
  return (
    <Card
      title="Events (Filtered)"
      subtitle="Minimal table — optimized for quick scanning"
      right={<span className="text-xs text-slate-400">{events.length} items</span>}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="text-left py-2 pr-3 font-medium">Event</th>
              <th className="text-left py-2 pr-3 font-medium">Type</th>
              <th className="text-left py-2 pr-3 font-medium">Gender</th>
              <th className="text-right py-2 pr-3 font-medium">Boys</th>
              <th className="text-right py-2 pr-3 font-medium">Girls</th>
              <th className="text-right py-2 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, idx) => (
              <tr key={idx} className="border-b border-slate-900/60">
                <td className="py-2 pr-3 text-slate-200">{e.name}</td>
                <td className="py-2 pr-3 text-slate-300">{e.type}</td>
                <td className="py-2 pr-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs ${
                      e.gender === "boys"
                        ? "bg-sky-500/20 text-sky-300"
                        : e.gender === "girls"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-violet-500/20 text-violet-300"
                    }`}
                  >
                    {e.gender}
                  </span>
                </td>
                <td className="py-2 pr-3 text-right">{e.b}</td>
                <td className="py-2 pr-3 text-right">{e.g}</td>
                <td className="py-2 text-right font-medium">{e.b + e.g}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
