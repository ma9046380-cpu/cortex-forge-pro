import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ChatInput = z.object({
  conversationId: z.string().uuid().nullable(),
  prompt: z.string().min(1).max(8000),
});

type Msg = { role: "user" | "assistant" | "system"; content: string };

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI Gateway not configured");

    // Resolve or create conversation
    let convId = data.conversationId;
    if (!convId) {
      const title = data.prompt.slice(0, 60);
      const { data: c, error } = await supabase
        .from("conversations")
        .insert({ user_id: userId, title })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      convId = c.id;
    }

    // Load history
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    const messages: Msg[] = [
      {
        role: "system",
        content:
          "You are Nexus AI, a sharp, helpful enterprise assistant. Use markdown. Be concise but thorough.",
      },
      ...((history ?? []) as Msg[]),
      { role: "user", content: data.prompt },
    ];

    // Persist user message
    await supabase.from("messages").insert({
      conversation_id: convId,
      user_id: userId,
      role: "user",
      content: data.prompt,
    });

    // Call AI Gateway
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
      throw new Error(`AI gateway error (${res.status})`);
    }

    const json = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const reply = json.choices?.[0]?.message?.content ?? "(no response)";

    await supabase.from("messages").insert({
      conversation_id: convId,
      user_id: userId,
      role: "assistant",
      content: reply,
    });

    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);

    return { conversationId: convId, reply };
  });

export const listConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { conversations: data ?? [] };
  });

export const getConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: msgs, error } = await context.supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", data.id)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { messages: msgs ?? [] };
  });

export const deleteConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("conversations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
