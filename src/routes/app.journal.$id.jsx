import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { moodBg } from "@/lib/mock-data";
import { ArrowLeft, Pin, Star, Trash, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEntry, deleteEntry, toggleEntryField } from "@/lib/db";
import { toast } from "sonner";
export const Route = createFileRoute("/app/journal/$id")({
  component: EntryPage,
});
function EntryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: entry, isLoading } = useQuery({
    queryKey: ["entry", id],
    queryFn: () => getEntry(id),
  });
  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!entry)
    return (
      <div className="text-center py-16">
        <h2 className="font-serif italic text-3xl">Entry not found</h2>
        <Link to="/app/journal" className="text-primary mt-4 inline-block">
          Back to journal
        </Link>
      </div>
    );
  async function toggle(field) {
    if (!entry) return;
    await toggleEntryField(entry.id, field, !entry[field]);
    await qc.invalidateQueries({ queryKey: ["entry", id] });
    await qc.invalidateQueries({ queryKey: ["entries"] });
  }
  async function remove() {
    if (!entry) return;
    if (!confirm("Delete this entry?")) return;
    await deleteEntry(entry.id);
    toast.success("Entry deleted");
    await qc.invalidateQueries({ queryKey: ["entries"] });
    navigate({ to: "/app/journal" });
  }
  return (
    <article className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate({ to: "/app/journal" })}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" /> All entries
      </button>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {new Date(entry.entry_date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {entry.mood ? (
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest rounded-md px-1.5 py-0.5",
                moodBg[entry.mood],
              )}
            >
              {entry.mood}
            </span>
          ) : null}
        </div>
        <h1 className="font-serif italic text-4xl md:text-5xl leading-tight">
          {entry.title || "Untitled"}
        </h1>
      </header>

      <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-base leading-[1.8] text-foreground/90">
        {entry.content}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {entry.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-muted text-muted-foreground px-2 py-1 text-xs font-medium"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-primary/5 border border-primary/15 p-5">
        <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
          <Sparkles className="size-3" /> Reflect with AI Coach
        </div>
        <p className="text-sm text-muted-foreground">
          Open the Coach to discuss this entry, find patterns, or get a gentle next step.
        </p>
        <Link to="/app/coach" className="mt-3 inline-block text-sm font-semibold text-primary">
          Open Coach →
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-2 justify-end">
        <button
          onClick={() => toggle("pinned")}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold",
            entry.pinned
              ? "border-primary text-primary bg-primary/10"
              : "border-border text-muted-foreground hover:bg-muted",
          )}
        >
          <Pin className="size-4" /> {entry.pinned ? "Pinned" : "Pin"}
        </button>
        <button
          onClick={() => toggle("favorite")}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold",
            entry.favorite
              ? "border-orange-warm text-orange-warm bg-orange-warm/10"
              : "border-border text-muted-foreground hover:bg-muted",
          )}
        >
          <Star className="size-4" /> {entry.favorite ? "Favorited" : "Favorite"}
        </button>
        <button
          onClick={remove}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 px-4 text-xs font-semibold"
        >
          <Trash className="size-4" /> Delete
        </button>
      </div>
    </article>
  );
}
