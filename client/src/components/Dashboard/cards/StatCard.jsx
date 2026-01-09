import Card from "../ui/Card";

export default function StatCard({ label, value, hint }) {
  return (
    <Card>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-slate-300 mt-1">{label}</p>
      {hint ? <p className="text-xs text-slate-500 mt-1">{hint}</p> : null}
    </Card>
  );
}
