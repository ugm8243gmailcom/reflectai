import { supabase } from "@/integrations/supabase/client";
// JOURNAL
export async function listEntries() {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("entry_date", { ascending: false });
  if (error) throw error;
  return data;
}
export async function getEntry(id) {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
export async function createEntry(payload, userId) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function deleteEntry(id) {
  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) throw error;
}
export async function toggleEntryField(id, field, value) {
  const patch = field === "pinned" ? { pinned: value } : { favorite: value };
  const { error } = await supabase.from("journal_entries").update(patch).eq("id", id);
  if (error) throw error;
}
// MOOD
export async function logMood(mood, userId, note) {
  const { error } = await supabase
    .from("mood_logs")
    .insert({ user_id: userId, mood, note: note ?? null });
  if (error) throw error;
}
export async function listMoods(days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase
    .from("mood_logs")
    .select("*")
    .gte("logged_at", since)
    .order("logged_at", { ascending: true });
  if (error) throw error;
  return data;
}
// HABITS
export async function listHabits() {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}
export async function createHabit(payload, userId) {
  const { error } = await supabase.from("habits").insert({ ...payload, user_id: userId });
  if (error) throw error;
}
export async function deleteHabit(id) {
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw error;
}
export async function listHabitLogs(days = 30) {
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("habit_logs")
    .select("habit_id, log_date")
    .gte("log_date", since);
  if (error) throw error;
  return data;
}
export async function toggleHabitToday(habitId, userId, done) {
  const today = new Date().toISOString().slice(0, 10);
  if (done) {
    const { error } = await supabase
      .from("habit_logs")
      .insert({ habit_id: habitId, user_id: userId, log_date: today });
    if (error && !String(error.message).includes("duplicate")) throw error;
  } else {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("log_date", today);
    if (error) throw error;
  }
}
// GOALS
export async function listGoals() {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function createGoal(p, userId) {
  const { error } = await supabase.from("goals").insert({ ...p, user_id: userId });
  if (error) throw error;
}
export async function updateGoalProgress(id, progress) {
  const { error } = await supabase.from("goals").update({ progress }).eq("id", id);
  if (error) throw error;
}
export async function deleteGoal(id) {
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw error;
}
// COACH messages
export async function listCoachMessages() {
  const { data, error } = await supabase
    .from("coach_messages")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}
export async function saveCoachMessage(role, content, userId) {
  const { error } = await supabase
    .from("coach_messages")
    .insert({ user_id: userId, role, content });
  if (error) throw error;
}
