import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listCoachMessages, saveCoachMessage } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
export const Route = createFileRoute("/app/coach")({
  component: Coach,
});
const SUGGESTIONS = [
  "What patterns do you notice in my week?",
  "Why am I feeling stressed lately?",
  "How can I be more consistent with my habits?",
  "Summarize my last 7 days.",
];
const GREETING = {
  id: "greeting",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hi — I'm your ReflectAI coach. I'm here to help you notice patterns, untangle thoughts, and take gentle next steps. What's on your mind?",
    },
  ],
};
function Coach() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: history, isLoading } = useQuery({
    queryKey: ["coach"],
    queryFn: listCoachMessages,
  });
  const initial = (history ?? []).length
    ? (history ?? []).map((m) => ({
        id: m.id,
        role: m.role,
        parts: [{ type: "text", text: m.content }],
      }))
    : [GREETING];
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const taRef = useRef(null);
  const lastSavedRef = useRef(new Set());
  const transport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status } = useChat({
    id: "coach",
    messages: initial,
    transport,
    onError: (err) => toast.error(err.message || "AI request failed"),
    onFinish: async ({ message }) => {
      if (!user || lastSavedRef.current.has(message.id)) return;
      const text = message.parts
        .map((p) => (p.type === "text" ? p.text : ""))
        .join("")
        .trim();
      if (!text) return;
      lastSavedRef.current.add(message.id);
      try {
        await saveCoachMessage("assistant", text, user.id);
        qc.invalidateQueries({ queryKey: ["coach"] });
      } catch {
        /* ignore */
      }
    },
  });
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);
  useEffect(() => {
    taRef.current?.focus();
  }, []);
  const busy = status === "submitted" || status === "streaming";
  async function send(text) {
    const t = text.trim();
    if (!t || !user) return;
    setInput("");
    try {
      await saveCoachMessage("user", t, user.id);
    } catch {
      /* non-fatal */
    }
    sendMessage({ text: t });
  }
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading conversation…</div>;
  }
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)]">
      <header className="mb-4 flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h1 className="font-serif italic text-2xl leading-tight">AI Coach</h1>
          <p className="text-xs text-muted-foreground">
            A private space to think out loud. Powered by Lovable AI.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto rounded-3xl bg-card border border-border p-4 md:p-6 space-y-4">
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          return (
            <div
              key={m.id}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" ? (
                <div className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Sparkles className="size-4" />
                </div>
              ) : null}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "text-foreground",
                )}
              >
                {text}
              </div>
            </div>
          );
        })}
        {busy ? (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center">
              <Sparkles className="size-4 animate-pulse" />
            </div>
            <div className="text-sm text-muted-foreground italic">Reflecting…</div>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={busy}
              className="text-xs rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-2xl bg-card border border-border p-2 pl-4"
        >
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask anything about your reflections…"
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none py-2 max-h-40"
          />
          <button
            type="submit"
            className="size-10 rounded-xl bg-primary text-primary-foreground grid place-items-center disabled:opacity-50 shrink-0"
            disabled={!input.trim() || busy}
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
