import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Nexus AI" },
      { name: "description", content: "Simple, transparent pricing for teams of every size." },
    ],
  }),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    period: "/forever",
    desc: "For individuals exploring AI.",
    features: ["100 AI requests / mo", "1 workspace", "Community support"],
    cta: "Start free",
    href: "/register",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For growing teams shipping fast.",
    features: ["10K AI requests / mo", "Unlimited workspaces", "Priority support", "Advanced analytics"],
    cta: "Start Pro trial",
    href: "/register",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations at scale.",
    features: ["Unlimited requests", "SSO + SAML", "SOC 2 reports", "Dedicated CSM", "On-prem option"],
    cta: "Contact sales",
    href: "/contact",
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-32">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Pricing that <span className="gradient-text">scales with you</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={
                "glass relative rounded-2xl p-8 " +
                (t.featured ? "border-primary/50 glow shadow-elevated" : "")
              }
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline">
                <span className="text-4xl font-semibold">{t.price}</span>
                <span className="ml-1 text-sm text-muted-foreground">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={
                  "mt-8 w-full " +
                  (t.featured ? "gradient-primary text-primary-foreground glow" : "")
                }
                variant={t.featured ? "default" : "outline"}
              >
                <Link to={t.href}>{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
