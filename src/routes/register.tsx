import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { AuthShell, Field, Divider } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Nexus AI" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — welcome to Nexus AI");
    nav({ to: "/dashboard" });
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) toast.error("Google sign-up failed");
  };

  return <AuthShell title="Create your workspace" subtitle="Start building with AI in under a minute">
    <form onSubmit={onSubmit} className="space-y-4">
      <Field id="name" label="Full name" value={name} onChange={setName} />
      <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
      <Field id="password" label="Password" type="password" value={password} onChange={setPassword} />
      <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground glow">
        {loading ? "Creating..." : "Create account"}
      </Button>
    </form>
    <Divider />
    <Button onClick={onGoogle} variant="outline" className="w-full">Continue with Google</Button>
    <p className="mt-6 text-center text-sm text-muted-foreground">
      Already have one? <Link to="/login" className="text-primary-glow hover:underline">Sign in</Link>
    </p>
  </AuthShell>;
}
