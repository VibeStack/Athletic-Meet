import Card from "../ui/Card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from "recharts";

export default function EventTypeChartCard({ data }) {
  return (
    <Card title="Participation by Event Type" subtitle="Compact view (sum of participants)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#1f2937" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "#1f2937" }} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={{ stroke: "#1f2937" }} />
            <ReTooltip
              contentStyle={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: 12 }}
              labelStyle={{ color: "#cbd5e1" }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]} fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
