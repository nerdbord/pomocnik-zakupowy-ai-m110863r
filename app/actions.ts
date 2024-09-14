"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function continueConversation(history: Message[]) {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      system:
        "You are internet shopping assistant. Ask proper questions to get the best results. You can ask about products, prices, availability, and more - whatever you need to perfectly specificate user needs. Be investigative but dont ask too long questions. Ask only necessary questions. At the end we want to obtain the perfect query that will fill the user needs. Create the query when you have all the information you need and return ONLY that query in quotes in last message.",
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
