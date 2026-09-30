import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Check, Flame, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listHabits, listHabitLogs, createHabit, deleteHabit, toggleHabitToday } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
export const Route = createFileRoute("/app/habits")({
  component: Habits,
});
const TODAY = new Date().toISOString().slice(0, 10);
function Habits() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const { data: habits = [] } = useQuery({ queryKey: ["habits"], queryFn: listHabits });
  const { data: logs = [] } = useQuery({
    queryKey: ["habit_logs"],
    queryFn: () => listHabitLogs(30),
  });
  const logsByHabit = new Map();
  for (const l of logs) {
    if (!logsByHabit.has(l.habit_id)) logsByHabit.set(l.habit_id, new Set());
    logsByHabit.get(l.habit_id).add(l.log_date);
  }
  const completedToday = habits.filter((h) => logsByHabit.get(h.id)?.has(TODAY)).length;
  const completion = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;
  const toggle = useMutation({
    mutationFn: async (vars) => toggleHabitToday(vars.id, user.id, vars.done),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habit_logs"] }),
  });
  const create = useMutation({
    mutationFn: async () => createHabit({ name, emoji }, user.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
      setCreating(false);
      setName("");
      setEmoji("✨");
      toast.success("Habit added");
    },
  });
  const remove = useMutation({
    mutationFn: async (id) => deleteHabit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
  function streakFor(habitId) {
    const set = logsByHabit.get(habitId);
    if (!set) return 0;
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      if (set.has(d)) streak++;
      else break;
    }
    return streak;
  }
  return (
    <div>
      <PageHeader
        eyebrow="Habits"
        title="Today, gently."
        description={
          habits.length === 0
            ? "Add your first daily ritual."
            : `${completion}% complete · keep the streak alive`
        }
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 text-sm font-semibold"
          >
            <Plus className="size-4" /> New habit
          </button>
        }
      />

      {creating ? (
        <div className="rounded-3xl bg-card border border-border p-6 mb-6 space-y-3">
          <div className="flex gap-3">
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              className="w-16 h-11 rounded-xl border border-input bg-surface px-3 text-center text-xl"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning meditation"
              className="flex-1 h-11 rounded-xl border border-input bg-surface px-4 text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setCreating(false)}
              className="h-10 rounded-full border border-border px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => name.trim() && create.mutate()}
              className="h-10 rounded-full bg-primary text-primary-foreground px-5 text-xs font-semibold disabled:opacity-50"
              disabled={!name.trim() || create.isPending}
            >
              Add habit
            </button>
          </div>
        </div>
      ) : null}

      {habits.length > 0 && (
        <div className="rounded-3xl bg-card border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Today
            </div>
            <div className="text-xs font-semibold text-primary">{completion}%</div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-soft"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {habits.map((h) => {
          const done = !!logsByHabit.get(h.id)?.has(TODAY);
          const streak = streakFor(h.id);
          return (
            <div key={h.id} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-11 rounded-2xl bg-muted grid place-items-center text-2xl">
                  {h.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{h.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Flame className="size-3 text-orange-warm" />
                    {streak} day streak
                  </div>
                </div>
                <button
                  onClick={() => toggle.mutate({ id: h.id, done: !done })}
                  className={cn(
                    "size-10 rounded-full border-2 grid place-items-center transition",
                    done
                      ? "bg-emerald-growth border-emerald-growth text-white"
                      : "border-border text-transparent hover:border-emerald-growth",
                  )}
                  aria-label="toggle"
                >
                  <Check className="size-5" />
                </button>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                30-day consistency
              </div>
              <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(30, 1fr)" }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const d = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
                  const did = logsByHabit.get(h.id)?.has(d);
                  return (
                    <div
                      key={i}
                      className={cn("h-6 rounded-sm", did ? "bg-primary/80" : "bg-muted")}
                    />
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-end">
                <button
                  onClick={() => remove.mutate(h.id)}
                  className="text-muted-foreground hover:text-destructive text-xs flex items-center gap-1"
                >
                  <Trash className="size-3" /> Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
