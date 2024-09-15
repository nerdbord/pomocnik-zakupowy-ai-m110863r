"use client";

import { useState, useRef, useEffect } from "react";
import { Message, continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sun, Moon, Loader2, ShoppingBag } from "lucide-react";
import { categories, subcategories, questionsBySubcategory } from "@/app/categoryData"

const OptionTile = ({ option, onSelect }: { option: string; onSelect: (option: string) => void }) => (
  <Button
    onClick={() => onSelect(option)}
    className="m-1 bg-indigo-500 text-white hover:bg-indigo-600"
  >
    {option}
  </Button>
);

function ChatInterface() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSubmit = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: "user", content: messageContent };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");

    console.log("Wysyłanie konwersacji do serwera:", JSON.stringify([...conversation, userMessage], null, 2));

    try {
      const { newMessage } = await continueConversation([
        ...conversation,
        userMessage,
      ]);

      let textContent = "";
      const assistantMessage: Message = { role: "assistant", content: "" };

      setConversation((prev) => [...prev, assistantMessage]);

      for await (const delta of readStreamableValue(newMessage)) {
        textContent += delta;

        const optionsMatch = textContent.match(/OPTIONS:\s*\[(.*?)\]/);
        if (optionsMatch && optionsMatch[1]) {
          const newOptions = optionsMatch[1].split(',').map(option => option.trim());
          console.log("Parsowane opcje:", newOptions);
          setOptions(newOptions);
          textContent = textContent.replace(/OPTIONS:\s*\[.*?\]/, '').trim();
        }

        setConversation((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...assistantMessage,
            content: textContent,
          };
          return updatedMessages;
        });
      }

      console.log("Końcowa treść wiadomości:", textContent);
      console.log("Końcowe opcje:", options);
    } catch (error) {
      console.error("Błąd w konwersacji:", error);
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Przepraszam, wystąpił błąd. Proszę spróbować ponownie.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(input);
  };

  const handleOptionSelect = (option: string) => {
    handleSubmit(option);
  };

  const handleCategorySelect = (category: string) => {
    handleSubmit(category);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Górna listwa z logo */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Shoppy</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Przełącz motyw</span>
          </Button>
        </div>
      </header>

      {/* Główna zawartość czatu */}
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
          <main className="flex-grow overflow-auto p-6">
            <div className="mb-6">
              <p className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
                Dzień dobry! Jestem Twoim asystentem zakupowym. Co chciałbyś kupić?
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    onClick={() => handleCategorySelect(category)}
                    className="bg-indigo-500 text-white hover:bg-indigo-600"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <AnimatePresence>
              {conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                    } mb-4`}
                >
                  <div
                    className={`flex items-end ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                  >
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`mx-2 py-2 px-3 rounded-lg ${message.role === "user"
                        ? "bg-purple-400 text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </main>
          <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
            {options.length > 0 && (
              <div className="flex flex-wrap justify-center mb-4">
                {options.map((option, index) => (
                  <OptionTile key={index} option={option} onSelect={handleOptionSelect} />
                ))}
              </div>
            )}
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Wpisz swoją wiadomość..."
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                className="flex-grow text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-500 text-white rounded-full px-6 py-2 font-semibold transition-all duration-200 hover:bg-indigo-600"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Myślę...
                  </span>
                ) : (
                  "Wyślij"
                )}
              </Button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function ThemeWrapper() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ChatInterface />
    </ThemeProvider>
  );
}