import { createFileRoute, Link } from "@tanstack/react-router";
import { MoodSelector } from "@/components/MoodSelector";
import { moodBg } from "@/lib/mock-data";
import { ArrowRight, Flame, Pencil, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listEntries, listHabits, listHabitLogs, listMoods, logMood } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/app/")({
  component: Dashboard,
});
function greet() {
  const h = new Date().getHours();
  if (h < 5) return "Late night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
const MOOD_SCORE = { happy: 5, calm: 4, neutral: 3, sad: 2, angry: 1 };
function Dashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: entries = [] } = useQuery({ queryKey: ["entries"], queryFn: listEntries });
  const { data: habits = [] } = useQuery({ queryKey: ["habits"], queryFn: listHabits });
  const { data: logs = [] } = useQuery({
    queryKey: ["habit_logs"],
    queryFn: () => listHabitLogs(7),
  });
  const { data: moods = [] } = useQuery({ queryKey: ["moods"], queryFn: () => listMoods(30) });
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      return data;
    },
  });
  const [savingMood, setSavingMood] = useState(null);
  async function saveMood(m) {
    if (!user) return;
    setSavingMood(m);
    try {
      await logMood(m, user.id);
      toast.success("Mood logged");
      qc.invalidateQueries({ queryKey: ["moods"] });
    } finally {
      setSavingMood(null);
    }
  }
  // streak: consecutive days (back from today) with at least one entry
  const days = new Set(entries.map((e) => e.entry_date.slice(0, 10)));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (days.has(d)) streak++;
    else if (i > 0) break;
  }
  const monthStart = new Date();
  monthStart.setDate(1);
  const entriesThisMonth = entries.filter((e) => new Date(e.entry_date) >= monthStart).length;
  const moodAvg =
    moods.length === 0
      ? 0
      : moods.reduce((s, m) => s + (MOOD_SCORE[m.mood] ?? 3), 0) / moods.length;
  // build week mood bars
  const week = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const dayMoods = moods.filter((m) => m.logged_at.slice(0, 10) === key);
    const avg = dayMoods.length
      ? dayMoods.reduce((s, m) => s + (MOOD_SCORE[m.mood] ?? 3), 0) / dayMoods.length
      : 0;
    return {
      day: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 3),
      score: avg,
    };
  });
  const todayKey = new Date().toISOString().slice(0, 10);
  const doneToday = new Set(logs.filter((l) => l.log_date === todayKey).map((l) => l.habit_id));
  const name = profile?.display_name || user?.email?.split("@")[0] || "there";
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/60">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h1 className="font-serif italic text-4xl md:text-5xl">
          {greet()}, {name}.
        </h1>
        <p className="text-muted-foreground">
          {streak > 0 ? (
            <>
              You're on a <span className="text-primary font-semibold">{streak}-day streak</span>.
              Take three minutes for yourself.
            </>
          ) : (
            <>Take three minutes for yourself.</>
          )}
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <Stat
          label="Streak"
          value={String(streak)}
          suffix="days"
          icon={<Flame className="size-4" />}
        />
        <Stat
          label="Entries"
          value={String(entriesThisMonth)}
          suffix="this month"
          icon={<Pencil className="size-4" />}
        />
        <Stat
          label="Mood avg"
          value={moodAvg ? moodAvg.toFixed(1) : "—"}
          suffix={moodAvg ? "/ 5" : ""}
          icon={<Sparkles className="size-4" />}
        />
      </section>

      <section className="rounded-3xl bg-card border border-border p-6 shadow-soft">
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-5">
          How are you feeling today?
        </div>
        <MoodSelector onChange={saveMood} value={savingMood ?? undefined} />
        <Link
          to="/app/journal/new"
          className="mt-6 w-full inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
        >
          Start writing
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="rounded-3xl bg-primary text-primary-foreground p-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 size-44 rounded-full border-[16px] border-white/5" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="size-3" />
            AI Reflection
          </div>
          <p className="font-serif italic text-xl leading-snug max-w-xl">
            {entries.length === 0
              ? '"Write your first entry. I\'ll be here to listen and find the patterns with you."'
              : `"You've written ${entries.length} ${entries.length === 1 ? "entry" : "entries"} so far. Open the Coach to talk through what's surfacing."`}
          </p>
          <Link
            to="/app/coach"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold opacity-90 hover:opacity-100"
          >
            Open AI Coach <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">Mood this week</h2>
            <Link to="/app/analytics" className="text-xs text-primary font-semibold">
              Analytics →
            </Link>
          </div>
          <div className="flex items-end gap-3 h-32">
            {week.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary/30 to-primary"
                  style={{
                    height: `${(d.score / 5) * 100}%`,
                    minHeight: d.score ? 6 : 2,
                    opacity: d.score ? 1 : 0.2,
                  }}
                />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">Today's habits</h2>
            <Link to="/app/habits" className="text-xs text-primary font-semibold">
              Manage →
            </Link>
          </div>
          {habits.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No habits yet. Add one to start tracking.
            </div>
          ) : (
            <div className="space-y-3">
              {habits.slice(0, 5).map((h) => (
                <div key={h.id} className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-muted grid place-items-center text-lg">
                    {h.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{h.name}</div>
                  </div>
                  <div
                    className={cn(
                      "size-5 rounded-full border-2",
                      doneToday.has(h.id)
                        ? "border-emerald-growth bg-emerald-growth"
                        : "border-border",
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Recent entries</h2>
          <Link to="/app/journal" className="text-xs text-primary font-semibold">
            All entries →
          </Link>
        </div>
        {entries.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-8 text-center text-sm text-muted-foreground">
            No entries yet.{" "}
            <Link to="/app/journal/new" className="text-primary font-semibold">
              Write your first →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {entries.slice(0, 4).map((e) => (
              <Link
                key={e.id}
                to="/app/journal/$id"
                params={{ id: e.id }}
                className="rounded-2xl bg-card border border-border p-5 hover:shadow-elevated transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-primary/40">
                    {new Date(e.entry_date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="size-1 rounded-full bg-border" />
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
                <h3 className="font-bold mb-1">{e.title || "Untitled"}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{e.content}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
function Stat({ label, value, suffix, icon }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center justify-between text-muted-foreground mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <div className="font-serif italic text-3xl">{value}</div>
        {suffix ? <div className="text-xs text-muted-foreground">{suffix}</div> : null}
      </div>
    </div>
  );
}
