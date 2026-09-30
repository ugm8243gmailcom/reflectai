import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listCoachMessages, saveCoachMessage } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { askCoachAI } from "@/lib/coach-server";
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
  content: "Hi — I'm your ReflectAI coach. I'm here to help you notice patterns, untangle thoughts, and take gentle next steps. What's on your mind?",
};

function Coach() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: dbHistory = [], isLoading } = useQuery({
    queryKey: ["coach"],
    queryFn: listCoachMessages,
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const taRef = useRef(null);

  // Sync state with DB history on initial load or reload
  useEffect(() => {
    if (dbHistory && dbHistory.length > 0) {
      setMessages(dbHistory);
    } else {
      setMessages([GREETING]);
    }
  }, [dbHistory]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  async function send(text) {
    const t = text.trim();
    if (!t || busy) return;

    setInput("");
    const userMsg = { id: `user-${Date.now()}`, role: "user", content: t };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setBusy(true);

    try {
      // 1. Save user message to MongoDB
      if (user) {
        await saveCoachMessage("user", t, user.id).catch(() => {});
      }

      // 2. Call Gemini server function
      const res = await askCoachAI({ data: { messages: nextMessages } });
      const aiText = res.text || "I'm reflecting on what you said. Tell me more.";

      const aiMsg = { id: `ai-${Date.now()}`, role: "assistant", content: aiText };
      setMessages((prev) => [...prev, aiMsg]);

      // 3. Save AI message to MongoDB
      if (user) {
        await saveCoachMessage("assistant", aiText, user.id).catch(() => {});
        qc.invalidateQueries({ queryKey: ["coach"] });
      }
    } catch (err) {
      console.error("Coach send error:", err);
      toast.error(err.message || "Failed to get AI response. Please check your Gemini API key.");
    } finally {
      setBusy(false);
    }
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading conversation…</div>;
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
            A private space to think out loud. Powered by Gemini 1.5 &amp; MongoDB memory.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto rounded-3xl bg-card border border-border p-4 md:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id || m._id}
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
                m.role === "user" ? "bg-primary text-primary-foreground" : "text-foreground bg-muted/40",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy ? (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center">
              <Sparkles className="size-4 animate-pulse" />
            </div>
            <div className="text-sm text-muted-foreground italic my-auto">ReflectAI is thinking…</div>
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
              className="text-xs rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary disabled:opacity-50 transition"
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
            className="size-10 rounded-xl bg-primary text-primary-foreground grid place-items-center disabled:opacity-50 shrink-0 hover:opacity-90 transition"
            disabled={!input.trim() || busy}
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
