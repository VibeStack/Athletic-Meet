import Card from "../ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";

export default function GenderChartCard({ boys, girls }) {
  const data = [
    { name: "Boys", value: boys, color: "#38bdf8" },
    { name: "Girls", value: girls, color: "#22c55e" }
  ];

  return (
    <Card title="Gender Participation (Donut)" subtitle="Boys vs Girls in filtered set">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={2}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <ReTooltip
              contentStyle={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: 12 }}
              labelStyle={{ color: "#cbd5e1" }}
              itemStyle={{ color: "#e2e8f0" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 text-sm mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: d.color }} />
            <span className="text-slate-300">
              {d.name}: <b className="text-slate-100">{d.value}</b>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
