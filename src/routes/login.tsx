import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Nexus AI" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav({ to: "/dashboard" });
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) toast.error("Google sign-in failed");
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to your workspace">
    <form onSubmit={onSubmit} className="space-y-4">
      <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
      <Field id="password" label="Password" type="password" value={password} onChange={setPassword} />
      <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground glow">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
    <Divider />
    <Button onClick={onGoogle} variant="outline" className="w-full">Continue with Google</Button>
    <p className="mt-6 text-center text-sm text-muted-foreground">
      No account? <Link to="/register" className="text-primary-glow hover:underline">Create one</Link>
    </p>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid-bg relative flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="glass-strong relative w-full max-w-md rounded-2xl p-8 shadow-elevated">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 font-semibold">
          <div className="grid size-8 place-items-center rounded-lg gradient-primary glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          Nexus AI
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ id, label, type = "text", value, onChange }: { id: string; label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required className="mt-1.5 bg-background/50" />
    </div>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" />
    </div>
  );
}
