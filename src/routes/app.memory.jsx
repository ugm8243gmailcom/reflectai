import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { MEMORIES } from "@/lib/mock-data";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
const CATEGORIES = [
  "All",
  "Life Lessons",
  "Achievements",
  "Dreams",
  "Important Moments",
  "Favorite Memories",
];
export const Route = createFileRoute("/app/memory")({
  component: Memory,
});
function Memory() {
  const [cat, setCat] = useState("All");
  const items = MEMORIES.filter((m) => cat === "All" || m.category === cat);
  return (
    <div>
      <PageHeader
        eyebrow="Memory Vault"
        title="The ones you'd never want to lose."
        description="Pin the moments that shaped you. They'll stay here, always."
        action={
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 text-sm font-semibold">
            <Plus className="size-4" /> New memory
          </button>
        }
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "text-xs rounded-full border px-3 py-1.5 font-semibold",
              cat === c
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => (
          <div
            key={m.id}
            className="rounded-3xl bg-gradient-to-br from-card to-muted/50 border border-border p-6 aspect-[4/5] flex flex-col justify-between hover:shadow-premium transition"
          >
            <div>
              <Heart className="size-5 text-orange-warm fill-current" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4">
                {m.category}
              </div>
              <h3 className="font-serif italic text-2xl mt-2 leading-tight">{m.title}</h3>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(m.date).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
