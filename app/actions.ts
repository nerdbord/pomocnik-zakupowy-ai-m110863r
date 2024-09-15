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
    console.log("Rozpoczęcie kontynuacji konwersacji");

    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
      system:
        "Jesteś polskojęzycznym asystentem zakupowym. Zadawaj odpowiednie pytania, aby uzyskać najlepsze wyniki. Możesz pytać o produkty, ceny, dostępność i więcej. Bądź konkretny. Stwórz końcowe zapytanie wyszukiwania, gdy będziesz mieć wszystkie potrzebne informacje. KOMUNIKUJ SIĘ WYŁĄCZNIE PO POLSKU. Twoim celem jest na podstawie wywiadu z użytkownikiem skonstruowanie query stringa do odpytania internetu",
      messages: history,
    });

    let fullResponse = "";

    for await (const text of textStream) {
      fullResponse += text;
      stream.update(text);
      console.log("Częściowa odpowiedź:", text);
    }

    console.log("Pełna odpowiedź:", fullResponse);

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}

export async function exampleServerAction(message: string) {
  "use server";

  console.log(
    "Przykładowa akcja serwerowa została wywołana z wiadomością:",
    message
  );

  // Tutaj możesz dodać logikę przetwarzania wiadomości

  return {
    response: `Serwer otrzymał wiadomość: "${message}" i ją przetworzyłem.`,
  };
}
