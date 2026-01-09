import Card from "../ui/Card";

export default function UpcomingEventsCard({ events }) {
  return (
    <Card title="Upcoming External Sports Events" subtitle="Previews of next meets (outside current 2-day meet)">
      <div className="grid md:grid-cols-3 gap-3">
        {events.map((ev) => (
          <div key={ev.title} className="rounded-2xl p-4 border border-slate-800 bg-slate-900/60">
            <p className="text-sm text-slate-300">{ev.level}</p>
            <h4 className="mt-1 font-semibold text-slate-100">{ev.title}</h4>
            <p className="text-sm text-slate-400 mt-1">{ev.host}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs border border-slate-700">
              <span aria-hidden>📅</span> {ev.date}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
