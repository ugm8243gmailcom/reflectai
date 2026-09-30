async function apiCall(action, payload = {}) {
  const res = await fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `API error for action ${action}`);
  }
  return res.json();
}

// JOURNAL ENTRIES
export async function listEntries() {
  return apiCall("listEntries");
}

export async function getEntry(id) {
  return apiCall("getEntry", { id });
}

export async function createEntry(payload, userId) {
  return apiCall("createEntry", { entry: payload, userId });
}

export async function deleteEntry(id) {
  return apiCall("deleteEntry", { id });
}

export async function toggleEntryField(id, field, value) {
  return apiCall("toggleEntryField", { id, field, value });
}

// MOOD LOGS
export async function logMood(mood, userId, note) {
  return apiCall("logMood", { mood, userId, note });
}

export async function listMoods(days = 30) {
  return apiCall("listMoods", { days });
}

// HABITS
export async function listHabits() {
  return apiCall("listHabits");
}

export async function createHabit(payload, userId) {
  return apiCall("createHabit", { habit: payload, userId });
}

export async function deleteHabit(id) {
  return apiCall("deleteHabit", { id });
}

export async function listHabitLogs(days = 30) {
  return apiCall("listHabitLogs", { days });
}

export async function toggleHabitToday(habitId, userId, done) {
  return apiCall("toggleHabitToday", { habitId, userId, done });
}

// GOALS
export async function listGoals() {
  return apiCall("listGoals");
}

export async function createGoal(p, userId) {
  return apiCall("createGoal", { goal: p, userId });
}

export async function updateGoalProgress(id, progress) {
  return apiCall("updateGoalProgress", { id, progress });
}

export async function deleteGoal(id) {
  return apiCall("deleteGoal", { id });
}

// COACH MESSAGES
export async function listCoachMessages() {
  return apiCall("listCoachMessages");
}

export async function saveCoachMessage(role, content, userId) {
  return apiCall("saveCoachMessage", { role, content, userId });
}
