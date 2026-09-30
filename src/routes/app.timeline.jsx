import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { ENTRIES, moodBg } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/app/timeline")({
  component: Timeline,
});
function Timeline() {
  return (
    <div>
      <PageHeader
        eyebrow="Timeline"
        title="Your life, in chapters"
        description="Scroll back through the days. Pause where it matters."
      />
      <div className="relative pl-6 md:pl-10">
        <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px bg-border" />
        {ENTRIES.map((e) => (
          <Link
            key={e.id}
            to="/app/journal/$id"
            params={{ id: e.id }}
            className="relative block mb-8 rounded-2xl bg-card border border-border p-5 hover:shadow-elevated transition"
          >
            <div className="absolute -left-[18px] md:-left-[26px] top-6 size-3.5 rounded-full bg-primary ring-4 ring-surface" />
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {new Date(e.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest rounded-md px-1.5 py-0.5",
                  moodBg[e.mood],
                )}
              >
                {e.mood}
              </span>
            </div>
            <h3 className="font-bold text-lg">{e.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{e.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
