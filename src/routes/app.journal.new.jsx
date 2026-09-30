import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MoodSelector } from "@/components/MoodSelector";
import { PROMPTS } from "@/lib/mock-data";
import { ArrowLeft, Sparkles, Mic, Image as ImageIcon, Hash, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { createEntry } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export const Route = createFileRoute("/app/journal/new")({
  component: NewEntry,
});
function NewEntry() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [mode, setMode] = useState("free");
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("calm");
  const [tags, setTags] = useState(["reflection"]);
  const [saving, setSaving] = useState(false);
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  async function save() {
    if (!user) return;
    if (!body.trim()) {
      toast.error("Write something first.");
      return;
    }
    setSaving(true);
    try {
      await createEntry(
        {
          title: title.trim() || (mode === "guided" ? prompt : body.trim().slice(0, 60)),
          content: body,
          mood,
          tags,
        },
        user.id,
      );
      await qc.invalidateQueries({ queryKey: ["entries"] });
      toast.success("Entry saved.");
      navigate({ to: "/app/journal" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save entry");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate({ to: "/app/journal" })}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" /> Back to journal
      </button>

      <div className="flex items-center gap-1 rounded-full bg-card border border-border p-1 w-fit mb-6">
        {["free", "guided"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "h-8 px-4 rounded-full text-xs font-semibold capitalize",
              mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {m === "free" ? "Free writing" : "Guided"}
          </button>
        ))}
      </div>

      {mode === "guided" ? (
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-5 mb-6">
          <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="size-3" /> Today's prompt
          </div>
          <p className="font-serif italic text-xl">"{prompt}"</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className={cn(
                  "text-xs rounded-full border px-3 py-1",
                  p === prompt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title — or leave blank"
          className="w-full bg-transparent text-3xl font-serif italic outline-none placeholder:text-muted-foreground/40"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing. There's no rush."
          className="mt-6 w-full bg-transparent text-base leading-relaxed outline-none min-h-[300px] resize-none placeholder:text-muted-foreground/40"
        />

        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
            How did this feel?
          </div>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-2">
          <Hash className="size-4 text-muted-foreground" />
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTags(tags.filter((x) => x !== t))}
              className="rounded-full bg-muted text-xs px-3 py-1 hover:bg-destructive/10 hover:text-destructive"
            >
              #{t} ×
            </button>
          ))}
          <input
            placeholder="Add tag…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value) {
                setTags([...tags, e.currentTarget.value.replace(/^#/, "")]);
                e.currentTarget.value = "";
              }
            }}
            className="bg-transparent text-xs outline-none placeholder:text-muted-foreground/60 flex-1 min-w-[120px]"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{words} words</span>
          <span>·</span>
          <span>{body.length} characters</span>
          <span>·</span>
          <span className="text-primary">Auto-saved</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="size-10 rounded-full bg-card border border-border grid place-items-center text-muted-foreground hover:text-foreground"
            aria-label="Voice"
          >
            <Mic className="size-4" />
          </button>
          <button
            className="size-10 rounded-full bg-card border border-border grid place-items-center text-muted-foreground hover:text-foreground"
            aria-label="Image"
          >
            <ImageIcon className="size-4" />
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 text-sm font-semibold disabled:opacity-60"
          >
            <Save className="size-4" /> {saving ? "Saving…" : "Save entry"}
          </button>
        </div>
      </div>
    </div>
  );
}
