<<<<<<< HEAD

export default function AIWorkspace() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        AI Workspace
      </h1>
    </div>
  )
=======
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Send, Plus, Trash2, Bot, User as UserIcon, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { sendChatMessage, listConversations, getConversation, deleteConversation } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/ai")({
  head: () => ({ meta: [{ title: "AI Workspace — Nexus AI" }] }),
  component: AIWorkspace,
});

const SUGGESTIONS = [
  "Draft a launch announcement for our new feature",
  "Summarize this week's sales pipeline",
  "Generate a SQL query to find top customers",
  "Write release notes from a changelog",
];

function AIWorkspace() {
  const qc = useQueryClient();
  const fetchConvs = useServerFn(listConversations);
  const fetchConv = useServerFn(getConversation);
  const sendFn = useServerFn(sendChatMessage);
  const delFn = useServerFn(deleteConversation);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: convData } = useQuery({ queryKey: ["convs"], queryFn: () => fetchConvs() });
  const { data: msgData } = useQuery({
    queryKey: ["conv", activeId],
    queryFn: () => fetchConv({ data: { id: activeId! } }),
    enabled: !!activeId,
  });

  const send = useMutation({
    mutationFn: (prompt: string) => sendFn({ data: { conversationId: activeId, prompt } }),
    onSuccess: (res) => {
      setActiveId(res.conversationId);
      qc.invalidateQueries({ queryKey: ["convs"] });
      qc.invalidateQueries({ queryKey: ["conv", res.conversationId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["convs"] });
      if (id === activeId) setActiveId(null);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgData, send.isPending]);

  const onSend = (text: string) => {
    if (!text.trim() || send.isPending) return;
    send.mutate(text.trim());
    setInput("");
  };

  return (
    <div className="flex h-screen">
      <div className="hidden w-72 shrink-0 flex-col border-r border-white/5 bg-sidebar/50 lg:flex">
        <div className="p-4">
          <Button onClick={() => setActiveId(null)} className="w-full gradient-primary text-primary-foreground glow">
            <Plus className="mr-1 size-4" /> New chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          {(convData?.conversations ?? []).map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-sidebar-accent/60",
                activeId === c.id && "bg-sidebar-accent",
              )}
              onClick={() => setActiveId(c.id)}
            >
              <Bot className="size-4 shrink-0 text-primary-glow" />
              <span className="flex-1 truncate">{c.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  del.mutate(c.id);
                }}
                className="opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 md:px-12">
          <div className="mx-auto max-w-3xl">
            {!activeId && (msgData?.messages.length ?? 0) === 0 && (
              <div className="text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl gradient-primary glow">
                  <Sparkles className="size-7 text-primary-foreground" />
                </div>
                <h1 className="mt-6 text-3xl font-semibold tracking-tight">How can I help today?</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ask anything. Nexus AI remembers your conversation.
                </p>
                <div className="mx-auto mt-8 grid max-w-2xl gap-3 md:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSend(s)}
                      className="glass rounded-xl p-4 text-left text-sm transition hover:border-primary/40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {(msgData?.messages ?? []).map((m) => (
                <Message key={m.id} role={m.role as "user" | "assistant"} content={m.content} />
              ))}
              {send.isPending && <Message role="assistant" content="…" pulse />}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 px-4 py-4 md:px-12">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend(input);
                }
              }}
              rows={1}
              placeholder="Message Nexus AI..."
              className="flex-1 resize-none rounded-xl glass px-4 py-3 text-sm outline-none focus:border-primary/40"
            />
            <Button
              onClick={() => onSend(input)}
              disabled={!input.trim() || send.isPending}
              className="gradient-primary text-primary-foreground glow"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
            Powered by Lovable AI · Gemini 3 Flash
          </p>
        </div>
      </div>
    </div>
  );
}

function Message({ role, content, pulse }: { role: "user" | "assistant"; content: string; pulse?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div className={cn("grid size-8 shrink-0 place-items-center rounded-lg", isUser ? "bg-secondary" : "gradient-primary glow")}>
        {isUser ? <UserIcon className="size-4" /> : <Bot className="size-4 text-primary-foreground" />}
      </div>
      <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm", isUser ? "bg-secondary" : "glass", pulse && "animate-pulse")}>
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
>>>>>>> 468f9075cec67ec109f6f66a10dbb49ba22950c1
}
