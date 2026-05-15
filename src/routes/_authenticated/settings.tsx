import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, Lock, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Nexus AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [pw, setPw] = useState("");
  const [emails, setEmails] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const onChangePassword = async () => {
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPw("");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage notifications, security, and preferences.</p>

      <div className="mt-8 grid max-w-3xl gap-6">
        <Section icon={Bell} title="Notifications">
          <Row label="Product emails" desc="Updates about your account and workspace.">
            <Switch checked={emails} onCheckedChange={setEmails} />
          </Row>
          <Row label="Marketing" desc="Tips, news, and special offers.">
            <Switch checked={marketing} onCheckedChange={setMarketing} />
          </Row>
        </Section>

        <Section icon={Lock} title="Security">
          <div className="space-y-2">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="bg-background/50" />
            <Button onClick={onChangePassword} className="gradient-primary text-primary-foreground glow">
              Update password
            </Button>
          </div>
        </Section>

        <Section icon={Palette} title="Appearance">
          <Row label="Theme" desc="Nexus AI is dark-mode native and dazzling.">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs">Dark · Default</span>
          </Row>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Bell; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary-glow" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {children}
    </div>
  );
}
