import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Plus, Target, Trash } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGoal, deleteGoal, listGoals, updateGoalProgress } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
export const Route = createFileRoute("/app/goals")({
  component: Goals,
});
function Goals() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: goals = [] } = useQuery({ queryKey: ["goals"], queryFn: listGoals });
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Growth",
    target_date: "",
  });
  const create = useMutation({
    mutationFn: async () =>
      createGoal({ ...form, target_date: form.target_date || null, progress: 0 }, user.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
      setCreating(false);
      setForm({ title: "", description: "", category: "Growth", target_date: "" });
      toast.success("Goal added");
    },
  });
  const update = useMutation({
    mutationFn: async (vars) => updateGoalProgress(vars.id, vars.progress),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
  const remove = useMutation({
    mutationFn: async (id) => deleteGoal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
  return (
    <div>
      <PageHeader
        eyebrow="Goals"
        title="What you're moving toward"
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 text-sm font-semibold"
          >
            <Plus className="size-4" /> New goal
          </button>
        }
      />

      {creating ? (
        <div className="rounded-3xl bg-card border border-border p-6 mb-6 space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Goal title"
            className="w-full h-11 rounded-xl border border-input bg-surface px-4 text-sm"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Why this matters…"
            rows={2}
            className="w-full rounded-xl border border-input bg-surface px-4 py-3 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-11 rounded-xl border border-input bg-surface px-4 text-sm"
            >
              {["Growth", "Fitness", "Career", "Life", "Relationships"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.target_date}
              onChange={(e) => setForm({ ...form, target_date: e.target.value })}
              className="h-11 rounded-xl border border-input bg-surface px-4 text-sm"
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
              onClick={() => form.title.trim() && create.mutate()}
              disabled={!form.title.trim() || create.isPending}
              className="h-10 rounded-full bg-primary text-primary-foreground px-5 text-xs font-semibold disabled:opacity-50"
            >
              Add goal
            </button>
          </div>
        </div>
      ) : null}

      {goals.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-10 text-center">
          <p className="font-serif italic text-2xl">A goal without a date is a dream.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first goal to start tracking progress.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <div
              key={g.id}
              className="rounded-3xl bg-card border border-border p-6 hover:shadow-elevated transition"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-md px-2 py-0.5">
                  {g.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {g.target_date
                    ? `by ${new Date(g.target_date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`
                    : "no target date"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-11 rounded-2xl bg-primary/5 text-primary grid place-items-center shrink-0">
                  <Target className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg leading-tight">{g.title}</h3>
                  {g.description ? (
                    <p className="text-sm text-muted-foreground mt-1">{g.description}</p>
                  ) : null}
                </div>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-bold text-primary">{g.progress}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={g.progress}
                  onChange={(e) => update.mutate({ id: g.id, progress: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
              <div className="mt-5 pt-5 border-t border-border flex items-center justify-end">
                <button
                  onClick={() => remove.mutate(g.id)}
                  className="text-muted-foreground hover:text-destructive text-xs flex items-center gap-1"
                >
                  <Trash className="size-3" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
