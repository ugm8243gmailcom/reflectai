import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { MOODS } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/app/calendar")({
  component: CalendarPage,
});
function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const moodIdx = (d * 7) % 5;
    const has = (d * 3) % 4 !== 0;
    cells.push({
      day: d,
      mood: has ? MOODS[moodIdx].emoji : undefined,
      count: has ? ((d * 2) % 3) + 1 : 0,
    });
  }
  return (
    <div>
      <PageHeader eyebrow="Calendar" title="A month at a glance" />
      <div className="rounded-3xl bg-card border border-border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="size-9 rounded-full hover:bg-muted grid place-items-center"
          >
            ‹
          </button>
          <div className="font-serif italic text-2xl">
            {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </div>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="size-9 rounded-full hover:bg-muted grid place-items-center"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((c, i) => (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-xl p-2 flex flex-col justify-between text-xs",
                c
                  ? "bg-surface hover:bg-muted cursor-pointer border border-transparent hover:border-border"
                  : "",
              )}
            >
              {c ? (
                <>
                  <div className="text-muted-foreground font-semibold">{c.day}</div>
                  <div className="flex items-end justify-between">
                    <span className="text-base">{c.mood ?? ""}</span>
                    {c.count ? (
                      <span className="text-[9px] rounded-full bg-primary/10 text-primary px-1.5">
                        {c.count}
                      </span>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-semibold">Legend:</span>
        {MOODS.map((m) => (
          <span key={m.id} className="flex items-center gap-1.5">
            <span className="text-base">{m.emoji}</span>
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
