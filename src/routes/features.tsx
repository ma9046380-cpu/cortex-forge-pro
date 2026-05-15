import { createFileRoute } from "@tanstack/react-router";
import { Bot, BarChart3, Shield, Zap, Cpu, Sparkles, Users, Lock, Globe, Workflow } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingShell";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Nexus AI" },
      { name: "description", content: "AI workspace, analytics, security, and admin controls." },
    ],
  }),
  component: FeaturesPage,
});

const GROUPS = [
  {
    title: "AI Workspace",
    items: [
      { icon: Bot, t: "Multi-model chat", d: "Switch between top models in one interface." },
      { icon: Sparkles, t: "Prompt history", d: "Replay, fork, and remix every conversation." },
      { icon: Workflow, t: "Smart suggestions", d: "Context-aware autocomplete that learns your style." },
    ],
  },
  {
    title: "Insights & Analytics",
    items: [
      { icon: BarChart3, t: "Realtime dashboard", d: "Track usage and revenue with live charts." },
      { icon: Zap, t: "Activity stream", d: "See exactly what your team is building, in real time." },
      { icon: Cpu, t: "Performance metrics", d: "P50, P95, P99 latency and error rates by endpoint." },
    ],
  },
  {
    title: "Security & Admin",
    items: [
      { icon: Shield, t: "Role-based access", d: "Admin, member, and custom roles out of the box." },
      { icon: Lock, t: "Row-level security", d: "Enforced at the database — not just the API." },
      { icon: Users, t: "User management", d: "Ban, role-change, delete — full admin panel." },
      { icon: Globe, t: "SSO + SAML", d: "Enterprise auth with one click." },
    ],
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-32">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Built for <span className="gradient-text">production AI</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every feature your team needs to ship AI products with confidence.
          </p>
        </div>

        <div className="mt-20 space-y-20">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h2 className="text-2xl font-semibold tracking-tight">{g.title}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {g.items.map((i) => (
                  <div key={i.t} className="glass rounded-2xl p-6">
                    <div className="grid size-10 place-items-center rounded-lg gradient-primary glow">
                      <i.icon className="size-5 text-primary-foreground" />
                    </div>
                    <div className="mt-4 font-semibold">{i.t}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{i.d}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
