import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ count: convCount }, { count: msgCount }, { data: recent }] = await Promise.all([
      supabase.from("conversations").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase
        .from("conversations")
        .select("id, title, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);
    return {
      conversations: convCount ?? 0,
      messages: msgCount ?? 0,
      recent: recent ?? [],
    };
  });

export const listAllUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, avatar_url, banned, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    return {
      users: (profiles ?? []).map((p) => ({ ...p, roles: roleMap.get(p.id) ?? ["user"] })),
    };
  });

export const setUserBanned = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ userId: z.string().uuid(), banned: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ banned: data.banned })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("activity_log").insert({
      user_id: context.userId,
      action: data.banned ? "user.banned" : "user.unbanned",
      metadata: { target: data.userId },
    });
    return { ok: true };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ userId: z.string().uuid(), role: z.enum(["admin", "user"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.role === "admin") {
      await supabaseAdmin.from("user_roles").upsert({ user_id: data.userId, role: "admin" });
    } else {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "admin");
    }
    await supabaseAdmin.from("activity_log").insert({
      user_id: context.userId,
      action: "user.role_changed",
      metadata: { target: data.userId, role: data.role },
    });
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("activity_log").insert({
      user_id: context.userId,
      action: "user.deleted",
      metadata: { target: data.userId },
    });
    return { ok: true };
  });

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const [{ count: users }, { count: convs }, { count: msgs }, { data: activity }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("conversations").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("messages").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("activity_log")
        .select("id, action, metadata, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    return {
      users: users ?? 0,
      conversations: convs ?? 0,
      messages: msgs ?? 0,
      activity: activity ?? [],
    };
  });

export const profile = {
  update: createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .inputValidator((d: unknown) =>
      z
        .object({
          full_name: z.string().max(100).optional(),
          bio: z.string().max(500).optional(),
          avatar_url: z.string().url().or(z.literal("")).optional(),
        })
        .parse(d),
    )
    .handler(async ({ data, context }) => {
      const { error } = await context.supabase
        .from("profiles")
        .update(data)
        .eq("id", context.userId);
      if (error) throw new Error(error.message);
      return { ok: true };
    }),
};
