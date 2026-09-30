import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json();
        if (!Array.isArray(messages)) return new Response("Messages required", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: `You are ReflectAI, a warm, perceptive personal-growth coach embedded in the user's private journal. 
You help users notice patterns in their thoughts, moods, habits and goals. 
Speak gently, like a wise friend. Use short paragraphs. Ask one good question at a time. 
Never give medical advice. Celebrate small wins. Mirror back what you hear before offering perspective.`,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
