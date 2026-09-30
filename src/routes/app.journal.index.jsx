import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { moodBg } from "@/lib/mock-data";
import { Plus, Pin, Star, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listEntries } from "@/lib/db";
export const Route = createFileRoute("/app/journal/")({
  component: JournalList,
});
function JournalList() {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const { data: all = [], isLoading } = useQuery({ queryKey: ["entries"], queryFn: listEntries });
  const entries = all.filter((e) => {
    if (filter === "pinned" && !e.pinned) return false;
    if (filter === "favorites" && !e.favorite) return false;
    if (q && !(e.title + e.content + e.tags.join(" ")).toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });
  return (
    <div>
      <PageHeader
        eyebrow="Journal"
        title="Your entries"
        description="Every thought, captured in its own quiet room."
        action={
          <Link
            to="/app/journal/new"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 text-sm font-semibold"
          >
            <Plus className="size-4" /> New entry
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] rounded-full bg-card border border-border px-4 h-10">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search entries, tags…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-card border border-border p-1">
          {["all", "pinned", "favorites"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-semibold capitalize",
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-10 text-center">
          <p className="font-serif italic text-2xl">A blank page is the start of every story.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {all.length === 0
              ? "Write your first entry to begin."
              : "No entries match that filter."}
          </p>
          <Link
            to="/app/journal/new"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 text-sm font-semibold"
          >
            <Plus className="size-4" /> New entry
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {entries.map((e) => (
            <Link
              key={e.id}
              to="/app/journal/$id"
              params={{ id: e.id }}
              className="rounded-2xl bg-card border border-border p-5 hover:shadow-elevated transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-primary/50">
                    {new Date(e.entry_date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {e.mood ? (
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest rounded-md px-1.5 py-0.5",
                        moodBg[e.mood],
                      )}
                    >
                      {e.mood}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  {e.pinned ? <Pin className="size-3.5 fill-current text-primary" /> : null}
                  {e.favorite ? <Star className="size-3.5 fill-current text-orange-warm" /> : null}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                {e.title || "Untitled"}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{e.content}</p>
              <div className="flex gap-1.5 mt-4 flex-wrap">
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
