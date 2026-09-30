import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { buildUserContext } from "@/lib/ai-context.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json();
        if (!Array.isArray(messages)) return new Response("Messages required", { status: 400 });

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) return new Response("Missing Gemini API key in environment variables", { status: 500 });

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

        const result = streamText({
          model: google("gemini-1.5-flash"),
          system: systemPrompt,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
