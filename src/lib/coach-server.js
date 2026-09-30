import { createServerFn } from "@tanstack/react-start";
import { buildUserContext } from "./ai-context.server";

export const askCoachAI = createServerFn({ method: "POST" })
  .validator((data) => data)
  .handler(async ({ data }) => {
    try {
      const { messages } = data;
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

      if (!apiKey || !apiKey.trim()) {
        throw new Error("Missing Gemini API key in .env file (GOOGLE_GENERATIVE_AI_API_KEY)");
      }

      const userContext = await buildUserContext("local-user");

      const systemPrompt = `You are ReflectAI, a warm, highly perceptive personal-growth coach embedded inside the user's private digital journal.

Your purpose is to help the user notice deep patterns, reflect on their thoughts, untangle stress, celebrate small wins, and stay grounded.

${userContext}

GUIDELINES FOR YOUR RESPONSES:
- Seamlessly reference their actual journal entries, specific moods, habit streaks, or goals whenever relevant to make them feel truly heard and remembered.
- Never act like this is your first time talking to them if there is context or history.
- Speak warmly and empathetically, like a wise friend.
- Keep paragraphs concise and easy to digest.
- End responses with one gentle, reflective question when appropriate to deepen their self-observation.
- Never give medical advice or clinical diagnosis.`;

      const contents = (messages || []).map((m) => {
        const text = m.content || (m.parts ? m.parts.map((p) => p.text || "").join("") : "");
        return {
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: text || "" }],
        };
      });

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        const msg = json.error?.message || `Google API error (Status ${res.status})`;
        if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
          throw new Error("Invalid Gemini API Key. Google AI Studio keys start with 'AIzaSy...'. Get a free key at https://aistudio.google.com/apikey");
        }
        throw new Error(msg);
      }

      const replyText =
        json.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm listening and reflecting on what you said. Tell me more.";

      return { text: replyText };
    } catch (err) {
      console.error("AI Coach Server Error:", err);
      throw new Error(err.message || "Failed to generate AI response");
    }
  });
