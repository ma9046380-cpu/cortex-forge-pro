import { Link, useRouter } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/features", label: "Features" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="grid size-8 place-items-center rounded-lg gradient-primary glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg tracking-tight">Nexus AI</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "text-sm text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  size="sm"
                  className="gradient-primary text-primary-foreground glow"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.navigate({ to: "/" });
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="gradient-primary text-primary-foreground glow">
                  <Link to="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/5 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link to={user ? "/dashboard" : "/login"} className="text-sm">
                {user ? "Dashboard" : "Sign in"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <div className="grid size-8 place-items-center rounded-lg gradient-primary">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              Nexus AI
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Enterprise AI for the next generation of teams.
            </p>
          </div>
          <FooterCol title="Product" links={[["Features", "/features"], ["Pricing", "/pricing"]]} />
          <FooterCol title="Company" links={[["Contact", "/contact"]]} />
          <FooterCol title="Account" links={[["Sign in", "/login"], ["Get started", "/register"]]} />
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Nexus AI. All rights reserved.</span>
          <span>Built on Lovable Cloud</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
