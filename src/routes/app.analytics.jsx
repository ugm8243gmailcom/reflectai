import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { MONTH_MOOD, TOPIC_BREAKDOWN, WEEK_MOOD } from "@/lib/mock-data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
export const Route = createFileRoute("/app/analytics")({
  component: Analytics,
});
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
function Analytics() {
  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="The shape of your year"
        description="Patterns your future self will thank you for noticing."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Stat label="Entries written" value="184" change="+12 vs last month" />
        <Stat label="Words" value="42.6k" change="≈ 1,420 / day" />
        <Stat label="Longest streak" value="38 days" change="Personal best" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card title="Weekly mood">
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={WEEK_MOOD}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly mood trend">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={MONTH_MOOD}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Topics you write about">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={TOPIC_BREAKDOWN}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {TOPIC_BREAKDOWN.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {TOPIC_BREAKDOWN.map((t, i) => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-muted-foreground">{t.name}</span>
                <span className="ml-auto font-bold">{t.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Habit consistency">
          <div className="space-y-4 mt-4">
            {[
              { n: "Meditation", v: 86, c: "var(--mood-happy)" },
              { n: "Reading", v: 72, c: "var(--mood-calm)" },
              { n: "Running", v: 54, c: "var(--orange-warm)" },
              { n: "Phone curfew", v: 67, c: "var(--mood-sad)" },
            ].map((h) => (
              <div key={h.n}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold">{h.n}</span>
                  <span className="text-muted-foreground">{h.v}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${h.v}%`, background: h.c }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
function Card({ title, children }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-6">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
        {title}
      </div>
      {children}
    </div>
  );
}
function Stat({ label, value, change }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-serif italic text-3xl mt-2">{value}</div>
      <div className="text-xs text-emerald-growth mt-1">{change}</div>
    </div>
  );
}
