<<<<<<< HEAD

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold p-10">
        Cortex Forge Pro
      </h1>
    </div>
  )
=======
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth-store";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-2xl p-10 text-center shadow-elevated">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the cloud</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground glow"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-2xl p-10 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-border bg-card px-4 py-2 text-sm">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nexus AI — Enterprise AI platform for modern teams" },
      {
        name: "description",
        content:
          "Nexus AI is the enterprise AI platform that powers your team's productivity with intelligent automation, real-time analytics, and unmatched security.",
      },
      { property: "og:title", content: "Nexus AI — Enterprise AI platform for modern teams" },
      { property: "og:description", content: "Aura AI Platform is an enterprise-grade AI SaaS application featuring a modern UI and scalable architecture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nexus AI — Enterprise AI platform for modern teams" },
      { name: "description", content: "Aura AI Platform is an enterprise-grade AI SaaS application featuring a modern UI and scalable architecture." },
      { name: "twitter:description", content: "Aura AI Platform is an enterprise-grade AI SaaS application featuring a modern UI and scalable architecture." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/xrAbqEdD4DeXUPaAbw90H7I23WE2/social-images/social-1778900332380-destination-2.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/xrAbqEdD4DeXUPaAbw90H7I23WE2/social-images/social-1778900332380-destination-2.webp" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthBridge() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setSession, setIsAdmin, setLoading } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        setTimeout(async () => {
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          setIsAdmin(!!data);
        }, 0);
      } else {
        setIsAdmin(false);
      }
      router.invalidate();
      queryClient.invalidateQueries();
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!data);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router, queryClient, setSession, setIsAdmin, setLoading]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBridge />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
>>>>>>> 468f9075cec67ec109f6f66a10dbb49ba22950c1
}
