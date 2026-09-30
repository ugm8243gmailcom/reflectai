import { getCollection } from "./mongo.server";

export async function buildUserContext(userId = "local-user") {
  try {
    const [entries, moods, habits, goals] = await Promise.all([
      getCollection("journal_entries")
        .then((c) => c.find({}).sort({ entry_date: -1 }).limit(7).toArray())
        .catch(() => []),

      getCollection("mood_logs")
        .then((c) => c.find({}).sort({ logged_at: -1 }).limit(14).toArray())
        .catch(() => []),

      getCollection("habits")
        .then((c) => c.find({ archived: { $ne: true } }).toArray())
        .catch(() => []),

      getCollection("goals")
        .then((c) => c.find({}).toArray())
        .catch(() => []),
    ]);

    const entrySummary = entries.length
      ? entries
          .map(
            (e) =>
              `- [${new Date(e.entry_date).toLocaleDateString()}] "${e.title || "Untitled"}" (Mood: ${e.mood || "unspecified"}, Tags: ${(e.tags || []).join(", ")}): ${e.content?.slice(0, 300)}...`
          )
          .join("\n")
      : "No journal entries written yet.";

    const moodSummary = moods.length
      ? moods
          .map(
            (m) =>
              `- [${new Date(m.logged_at).toLocaleDateString()}] Mood: ${m.mood}${m.note ? ` (Note: ${m.note})` : ""}`
          )
          .join("\n")
      : "No mood logs yet.";

    const habitSummary = habits.length
      ? habits.map((h) => `- ${h.name} ${h.emoji || ""} (Current streak: ${h.streak || 0} days)`).join("\n")
      : "No active habits.";

    const goalSummary = goals.length
      ? goals.map((g) => `- ${g.title || g.name}: ${g.progress || 0}% complete`).join("\n")
      : "No goals set yet.";

    return `
=== USER'S LIVE JOURNAL & MEMORY CONTEXT ===

RECENT JOURNAL ENTRIES:
${entrySummary}

RECENT MOOD TRACKING:
${moodSummary}

CURRENT HABITS:
${habitSummary}

CURRENT GOALS:
${goalSummary}
============================================`;
  } catch (err) {
    console.error("Error building AI context:", err);
    return "User context unavailable.";
  }
}
