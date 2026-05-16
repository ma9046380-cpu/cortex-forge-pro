import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MarketingNav, MarketingFooter } from "@/components/marketing/MarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nexus AI" },
      { name: "description", content: "Talk to our team about Nexus AI." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-32">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            Let's <span className="gradient-text">talk</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us about your project. We typically reply within one business day.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            <InfoCard icon={Mail} label="Email" value="hello@nexusai.com" />
            <InfoCard icon={MessageSquare} label="Sales" value="sales@nexusai.com" />
          </div>

          <form
            className="glass space-y-4 rounded-2xl p-6 md:col-span-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSending(true);
              setTimeout(() => {
                setSending(false);
                toast.success("Message sent — we'll be in touch soon.");
                (e.target as HTMLFormElement).reset();
              }, 800);
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required className="mt-1.5 bg-background/50" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required className="mt-1.5 bg-background/50" />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" className="mt-1.5 bg-background/50" />
            </div>
            <div>
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" rows={5} required className="mt-1.5 bg-background/50" />
            </div>
            <Button
              type="submit"
              disabled={sending}
              className="gradient-primary text-primary-foreground glow"
            >
              {sending ? "Sending..." : (
                <>
                  Send message <Send className="ml-1 size-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="grid size-9 place-items-center rounded-lg gradient-primary glow">
        <Icon className="size-4 text-primary-foreground" />
      </div>
      <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
