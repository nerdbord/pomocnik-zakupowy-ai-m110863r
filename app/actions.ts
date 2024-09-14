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
    console.log("Starting conversation continuation"); // Debug log

    const { textStream } = await streamText({
      model: openai("gpt-4o"),
      system:
        "You are an internet shopping assistant. Ask proper questions to get the best results. You can ask about products, prices, availability, and more. Be specific. ALWAYS provide 2-4 options for the user to choose from by adding a line at the end of your message in the exact format 'OPTIONS: [option1, option2, option3]'. The OPTIONS line should be on a new line at the very end of your message. Create the final search query when you have all the information you need.",
      messages: history,
    });

    let fullResponse = "";

    for await (const text of textStream) {
      fullResponse += text;
      stream.update(text);

      // Debug log to check if OPTIONS are being generated
      if (fullResponse.includes("OPTIONS:")) {
        console.log("Options detected in response:", fullResponse);
      }
    }

    console.log("Full response:", fullResponse); // Debug log for the entire response

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
