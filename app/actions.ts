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
        "Jesteś polskojęzycznym asystentem zakupowym. Zadawaj odpowiednie pytania, aby uzyskać najlepsze wyniki. Możesz pytać o produkty, ceny, dostępność i więcej. Bądź dociekliwy i doprecyzowuj. KOMUNIKUJ SIĘ WYŁĄCZNIE PO POLSKU. Nie zadawaj pytań dłuższych niż 200 znaków. Twoim celem jest na podstawie wywiadu z użytkownikiem skonstruowanie query stringa do odpytania internetu. Twoim celem jest zrozumienie potrzeb użytkownika i skonstruowanie odpowiedniego zapytania do wyszukiwarki. Kiedy będziesz miał wszystkie informacje zwróć w apostrofie TYLKO idealne query do odpytania wyszukiwarki. Na wzór: 'czerwona koszulka xl męska 600zł adidas'. W apostrofach nie zadawaj już pytań. W apostrofach nie zamiszczaj już też znaków zapytania. W apostrofach musi być min 5 znaków",
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

export async function exampleServerAction(message: string) {
  "use server";

  return {
    response: `Serwer otrzymał wiadomość: "${message}" i ją przetworzyłem.`,
  };
}
