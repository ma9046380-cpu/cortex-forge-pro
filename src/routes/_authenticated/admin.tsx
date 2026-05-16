import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Users, MessageSquare, Bot, Activity, Ban, ShieldCheck, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminStats,
  listAllUsers,
  setUserBanned,
  setUserRole,
  deleteUser,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Nexus AI" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw redirect({ to: "/dashboard" });
  },
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const fetchStats = useServerFn(getAdminStats);
  const fetchUsers = useServerFn(listAllUsers);
  const banFn = useServerFn(setUserBanned);
  const roleFn = useServerFn(setUserRole);
  const delFn = useServerFn(deleteUser);

  const { data: stats } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fetchStats() });
  const { data: users } = useQuery({ queryKey: ["admin-users"], queryFn: () => fetchUsers() });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const ban = useMutation({
    mutationFn: (v: { userId: string; banned: boolean }) => banFn({ data: v }),
    onSuccess: () => { toast.success("User updated"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const role = useMutation({
    mutationFn: (v: { userId: string; role: "admin" | "user" }) => roleFn({ data: v }),
    onSuccess: () => { toast.success("Role updated"); refresh(); },
  });
  const del = useMutation({
    mutationFn: (userId: string) => delFn({ data: { userId } }),
    onSuccess: () => { toast.success("User deleted"); refresh(); },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Admin <span className="gradient-text">Console</span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage users, roles, and platform activity.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat icon={Users} label="Total users" value={stats?.users ?? 0} />
        <Stat icon={MessageSquare} label="Conversations" value={stats?.conversations ?? 0} />
        <Stat icon={Bot} label="Messages" value={stats?.messages ?? 0} />
        <Stat icon={Activity} label="Recent events" value={stats?.activity.length ?? 0} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-semibold">Users</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users?.users ?? []).map((u) => {
                  const isAdmin = u.roles.includes("admin");
                  return (
                    <tr key={u.id} className="border-t border-white/5">
                      <td className="py-3">
                        <div className="font-medium">{u.full_name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td>
                        <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "Admin" : "User"}</Badge>
                      </td>
                      <td>
                        {u.banned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge variant="outline" className="text-success border-success/30">Active</Badge>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="inline-flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => role.mutate({ userId: u.id, role: isAdmin ? "user" : "admin" })}>
                            <ShieldCheck className="size-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => ban.mutate({ userId: u.id, banned: !u.banned })}>
                            <Ban className="size-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => confirm("Delete user?") && del.mutate(u.id)}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold">Activity log</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {(stats?.activity ?? []).length === 0 && (
              <li className="text-muted-foreground">No activity yet.</li>
            )}
            {(stats?.activity ?? []).map((a) => (
              <li key={a.id} className="border-l-2 border-primary/40 pl-3">
                <div className="font-medium">{a.action}</div>
                <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="size-5 text-primary-glow" />
      <div className="mt-3 text-3xl font-semibold">{value.toLocaleString()}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
