<<<<<<< HEAD

export default function HomePage() {
  return (
    <main className="p-10">
      <h2 className="text-3xl font-bold">
        AI SaaS Platform
      </h2>
    </main>
  )
=======
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, BarChart3, Bot, Cpu, ArrowRight, Check } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus AI — Enterprise AI platform for modern teams" },
      {
        name: "description",
        content:
          "Ship AI-powered products faster with a secure, scalable platform built for enterprise teams.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <Hero />
      <Logos />
      <Features />
      <Stats />
      <CTA />
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 glass px-3 py-1 text-xs"
        >
          <span className="size-1.5 rounded-full bg-primary-glow animate-pulse" />
          New • Realtime AI agents now live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl"
        >
          The enterprise AI platform that <span className="gradient-text">just works.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Build, deploy, and scale AI workflows in minutes. Real-time analytics, secure auth,
          role-based access, and a workspace your team will love.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Button asChild size="lg" className="gradient-primary text-primary-foreground glow">
            <Link to="/register">
              Start free <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/features">Explore features</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="glass-strong rounded-2xl p-2 shadow-elevated">
            <div className="aspect-[16/9] rounded-xl grid-bg relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-70"
                style={{ background: "var(--gradient-mesh)" }}
              />
              <div className="absolute inset-6 grid grid-cols-3 gap-4">
                {[
                  { icon: Bot, label: "AI Agents", val: "12.4K" },
                  { icon: BarChart3, label: "Requests", val: "2.1M" },
                  { icon: Shield, label: "Uptime", val: "99.99%" },
                ].map((s, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <s.icon className="size-5 text-primary-glow" />
                    <div className="mt-3 text-2xl font-semibold">{s.val}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Logos() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
        Trusted by teams at
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
        {["ACME", "VERTEX", "LUMEN", "ATLAS", "ORBIT", "NOVA"].map((n) => (
          <span key={n} className="text-lg font-bold tracking-widest">
            {n}
          </span>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Bot, title: "AI Workspace", desc: "Chat with multiple models, save prompts, replay history." },
  { icon: BarChart3, title: "Realtime Analytics", desc: "Track usage, revenue, and engagement live." },
  { icon: Shield, title: "Enterprise Security", desc: "RLS, role-based access, audit logs, SOC2 ready." },
  { icon: Zap, title: "Lightning Fast", desc: "Edge-deployed runtime, sub-100ms responses." },
  { icon: Cpu, title: "Scalable Infra", desc: "Built on Postgres + serverless, scales to millions." },
  { icon: Sparkles, title: "Premium UX", desc: "Glassmorphism, dark-first, designed by humans." },
];

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Everything your team needs
        </h2>
        <p className="mt-4 text-muted-foreground">
          One platform. Six superpowers. Zero compromises.
        </p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6 transition hover:border-primary/40"
          >
            <div className="grid size-10 place-items-center rounded-lg gradient-primary glow">
              <f.icon className="size-5 text-primary-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    ["99.99%", "Uptime SLA"],
    ["180ms", "P50 latency"],
    ["50M+", "Requests/day"],
    ["SOC 2", "Type II"],
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="glass-strong grid grid-cols-2 gap-8 rounded-2xl p-10 md:grid-cols-4">
        {items.map(([v, l]) => (
          <div key={l} className="text-center">
            <div className="text-3xl font-semibold gradient-text md:text-4xl">{v}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div
        className="glass-strong relative overflow-hidden rounded-3xl p-12 text-center md:p-20"
        style={{ background: "var(--gradient-mesh)" }}
      >
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Ready to ship the future?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Spin up your workspace in seconds. No credit card required.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="gradient-primary text-primary-foreground glow">
            <Link to="/register">Get started free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">Talk to sales</Link>
          </Button>
        </div>
        <ul className="mx-auto mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {["No credit card", "Cancel anytime", "Free tier forever"].map((x) => (
            <li key={x} className="flex items-center gap-2">
              <Check className="size-4 text-success" /> {x}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
>>>>>>> 468f9075cec67ec109f6f66a10dbb49ba22950c1
}
