import { createFileRoute } from "@tanstack/react-router";
import { getCollection } from "@/lib/mongo.server";
import { ObjectId } from "mongodb";
import { ENTRIES, HABITS, GOALS } from "@/lib/mock-data";

function normalize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

function normalizeAll(docs) {
  return docs.map(normalize);
}

function parseId(idStr) {
  try {
    if (ObjectId.isValid(idStr)) {
      return { $or: [{ _id: new ObjectId(idStr) }, { id: idStr }] };
    }
  } catch {
    /* fallback to string match */
  }
  return { id: idStr };
}

export const Route = createFileRoute("/api/db")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { action, payload = {} } = body;

          switch (action) {
            // JOURNAL ENTRIES
            case "listEntries": {
              const col = await getCollection("journal_entries");
              let docs = await col.find({}).sort({ entry_date: -1, created_at: -1 }).toArray();
              if (docs.length === 0) {
                // Seed initial entries if empty
                const seedDocs = ENTRIES.map((e) => ({
                  ...e,
                  entry_date: e.date || new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  user_id: "local-user",
                }));
                await col.insertMany(seedDocs);
                docs = await col.find({}).sort({ entry_date: -1, created_at: -1 }).toArray();
              }
              return Response.json(normalizeAll(docs));
            }

            case "getEntry": {
              const col = await getCollection("journal_entries");
              const doc = await col.findOne(parseId(payload.id));
              return Response.json(normalize(doc));
            }

            case "createEntry": {
              const col = await getCollection("journal_entries");
              const newDoc = {
                ...payload.entry,
                user_id: payload.userId || "local-user",
                entry_date: payload.entry.entry_date || new Date().toISOString(),
                created_at: new Date().toISOString(),
                tags: payload.entry.tags || [],
              };
              const res = await col.insertOne(newDoc);
              return Response.json({ ...newDoc, id: res.insertedId.toString() });
            }

            case "deleteEntry": {
              const col = await getCollection("journal_entries");
              await col.deleteOne(parseId(payload.id));
              return Response.json({ success: true });
            }

            case "toggleEntryField": {
              const col = await getCollection("journal_entries");
              const patch = payload.field === "pinned" ? { pinned: payload.value } : { favorite: payload.value };
              await col.updateOne(parseId(payload.id), { $set: patch });
              return Response.json({ success: true });
            }

            // MOOD LOGS
            case "logMood": {
              const col = await getCollection("mood_logs");
              const doc = {
                user_id: payload.userId || "local-user",
                mood: payload.mood,
                note: payload.note || null,
                logged_at: new Date().toISOString(),
              };
              await col.insertOne(doc);
              return Response.json({ success: true });
            }

            case "listMoods": {
              const col = await getCollection("mood_logs");
              const days = payload.days || 30;
              const since = new Date(Date.now() - days * 86400000).toISOString();
              const docs = await col
                .find({ logged_at: { $gte: since } })
                .sort({ logged_at: 1 })
                .toArray();
              return Response.json(normalizeAll(docs));
            }

            // HABITS
            case "listHabits": {
              const col = await getCollection("habits");
              let docs = await col.find({ archived: { $ne: true } }).sort({ created_at: 1 }).toArray();
              if (docs.length === 0) {
                // Seed initial habits
                const seedHabits = HABITS.map((h) => ({
                  ...h,
                  user_id: "local-user",
                  archived: false,
                  created_at: new Date().toISOString(),
                }));
                await col.insertMany(seedHabits);
                docs = await col.find({ archived: { $ne: true } }).sort({ created_at: 1 }).toArray();
              }
              return Response.json(normalizeAll(docs));
            }

            case "createHabit": {
              const col = await getCollection("habits");
              const doc = {
                ...payload.habit,
                user_id: payload.userId || "local-user",
                archived: false,
                created_at: new Date().toISOString(),
              };
              const res = await col.insertOne(doc);
              return Response.json({ ...doc, id: res.insertedId.toString() });
            }

            case "deleteHabit": {
              const col = await getCollection("habits");
              await col.deleteOne(parseId(payload.id));
              return Response.json({ success: true });
            }

            case "listHabitLogs": {
              const col = await getCollection("habit_logs");
              const days = payload.days || 30;
              const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
              const docs = await col.find({ log_date: { $gte: since } }).toArray();
              return Response.json(normalizeAll(docs));
            }

            case "toggleHabitToday": {
              const col = await getCollection("habit_logs");
              const today = new Date().toISOString().slice(0, 10);
              if (payload.done) {
                await col.updateOne(
                  { habit_id: payload.habitId, log_date: today },
                  { $set: { habit_id: payload.habitId, user_id: payload.userId || "local-user", log_date: today } },
                  { upsert: true }
                );
              } else {
                await col.deleteOne({ habit_id: payload.habitId, log_date: today });
              }
              return Response.json({ success: true });
            }

            // GOALS
            case "listGoals": {
              const col = await getCollection("goals");
              let docs = await col.find({}).sort({ created_at: -1 }).toArray();
              if (docs.length === 0) {
                const seedGoals = GOALS.map((g) => ({
                  ...g,
                  user_id: "local-user",
                  created_at: new Date().toISOString(),
                }));
                await col.insertMany(seedGoals);
                docs = await col.find({}).sort({ created_at: -1 }).toArray();
              }
              return Response.json(normalizeAll(docs));
            }

            case "createGoal": {
              const col = await getCollection("goals");
              const doc = {
                ...payload.goal,
                user_id: payload.userId || "local-user",
                created_at: new Date().toISOString(),
              };
              const res = await col.insertOne(doc);
              return Response.json({ ...doc, id: res.insertedId.toString() });
            }

            case "updateGoalProgress": {
              const col = await getCollection("goals");
              await col.updateOne(parseId(payload.id), { $set: { progress: payload.progress } });
              return Response.json({ success: true });
            }

            case "deleteGoal": {
              const col = await getCollection("goals");
              await col.deleteOne(parseId(payload.id));
              return Response.json({ success: true });
            }

            // COACH MESSAGES
            case "listCoachMessages": {
              const col = await getCollection("coach_messages");
              const docs = await col.find({}).sort({ created_at: 1 }).toArray();
              return Response.json(normalizeAll(docs));
            }

            case "saveCoachMessage": {
              const col = await getCollection("coach_messages");
              const doc = {
                user_id: payload.userId || "local-user",
                role: payload.role,
                content: payload.content,
                created_at: new Date().toISOString(),
              };
              const res = await col.insertOne(doc);
              return Response.json({ ...doc, id: res.insertedId.toString() });
            }

            default:
              return new Response(`Unknown action: ${action}`, { status: 400 });
          }
        } catch (err) {
          console.error("MongoDB API Error:", err);
          return new Response(err.message || "Database error", { status: 500 });
        }
      },
    },
  },
});
