import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { buildUserContext } from "./ai-context.server";

export const askCoachAI = createServerFn({ method: "POST" })
  .validator((data) => data)
  .handler(async ({ data }) => {
    try {
      const { messages } = data;
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY in environment variables (.env)");
      }

      const google = createGoogleGenerativeAI({ apiKey });
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

      const formattedMessages = (messages || []).map((m) => {
        const text = m.content || (m.parts ? m.parts.map((p) => p.text || "").join("") : "");
        return {
          role: m.role === "assistant" ? "assistant" : "user",
          content: text || "",
        };
      });

      const response = await generateText({
        model: google("gemini-1.5-flash"),
        system: systemPrompt,
        messages: formattedMessages,
      });

      return { text: response.text };
    } catch (err) {
      console.error("AI Coach Server Error:", err);
      throw new Error(err.message || "Failed to generate AI response");
    }
  });
