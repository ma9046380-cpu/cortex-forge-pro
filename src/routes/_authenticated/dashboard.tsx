<<<<<<< HEAD

export default function DashboardPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>
    </div>
  )
=======
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { MessageSquare, Bot, Sparkles, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getDashboardStats } from "@/lib/admin.functions";
import { useAuthStore } from "@/lib/auth-store";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Nexus AI" }] }),
  component: Dashboard,
});

const REVENUE = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  value: Math.round(8000 + Math.sin(i / 2) * 2500 + i * 850),
}));

function Dashboard() {
  const fetchStats = useServerFn(getDashboardStats);
  const { user } = useAuthStore();
  const { data } = useQuery({ queryKey: ["dashboard-stats"], queryFn: () => fetchStats() });

  return (
    <div className="p-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, <span className="gradient-text">{user?.user_metadata?.full_name || user?.email?.split("@")[0]}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening in your workspace.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={MessageSquare} label="Conversations" value={data?.conversations ?? 0} delta="+12%" />
        <StatCard icon={Bot} label="Messages sent" value={data?.messages ?? 0} delta="+24%" />
        <StatCard icon={Sparkles} label="AI tokens" value="124.3K" delta="+8%" />
        <StatCard icon={TrendingUp} label="Revenue (MRR)" value="$24,580" delta="+18%" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue</h3>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <AreaChart data={REVENUE}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.22 275)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.62 0.22 275)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.68 0.03 265)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.03 265)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.04 270)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="value" stroke="oklch(0.72 0.20 290)" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold">Recent activity</h3>
          <ul className="mt-4 space-y-3">
            {(data?.recent ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">No conversations yet — start one in AI Workspace.</li>
            )}
            {(data?.recent ?? []).map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <div className="mt-1 size-2 rounded-full bg-primary-glow" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{c.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(c.updated_at).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, delta }: { icon: typeof Bot; label: string; value: number | string; delta: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <Icon className="size-5 text-primary-glow" />
        <span className="text-xs text-success">{delta}</span>
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className="mt-3 h-8">
        <ResponsiveContainer>
          <LineChart data={Array.from({ length: 8 }, (_, i) => ({ v: 5 + Math.sin(i) * 3 + i * 0.6 }))}>
            <Line type="monotone" dataKey="v" stroke="oklch(0.72 0.20 290)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
>>>>>>> 468f9075cec67ec109f6f66a10dbb49ba22950c1
}
