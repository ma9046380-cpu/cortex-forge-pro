import { createFileRoute, Outlet, redirect, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Bot, User, Settings, Shield, LogOut, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { isAdmin, user } = useAuthStore();

  const items = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/ai", label: "AI Workspace", icon: Bot },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
    ...(isAdmin ? [{ to: "/admin", label: "Admin", icon: Shield }] : []),
  ] as const;

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-sidebar md:flex">
        <Link to="/" className="flex h-16 items-center gap-2 px-6 font-semibold">
          <div className="grid size-8 place-items-center rounded-lg gradient-primary glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          Nexus AI
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                path === i.to
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60",
              )}
            >
              <i.icon className="size-4" />
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 p-3">
          <div className="mb-2 truncate px-3 text-xs text-muted-foreground">{user?.email}</div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.navigate({ to: "/" });
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/60"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
