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

const OptionTile = ({ option, onSelect }: { option: string; onSelect: (option: string) => void }) => (
  <Button
    onClick={() => onSelect(option)}
    className="m-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: "user", content: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");

    console.log("Sending conversation to server:", JSON.stringify([...conversation, userMessage], null, 2));

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
          console.log("Parsed options:", newOptions);
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

      console.log("Final text content:", textContent);
      console.log("Final options:", options);
    } catch (error) {
      console.error("Error in conversation:", error);
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setInput(option);
    handleSubmit({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);
  };

  console.log("Current options:", options);

  return (
    <div className="flex flex-col h-screen bg-primary text-foreground ">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg transform -skew-x-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Shoppy
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full text-primary-foreground hover: hover:bg-opacity-10"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>
      <main className="flex-grow overflow-auto p-4 lg:w-[40rem] mx-auto">
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
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {message.role === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 py-3 px-4 rounded-lg ${message.role === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                      : "bg-primary text-primary-foreground border"
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
      <footer className="p-4 border-t border-border">
        {options.length > 0 && (
          <div className="flex flex-wrap justify-center mb-4">
            {options.map((option, index) => (
              <OptionTile key={index} option={option} onSelect={handleOptionSelect} />
            ))}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 lg:max-w-[40rem] mx-auto"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            className="flex-grow text-primary-foreground"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-6 py-2 font-semibold transition-all duration-200 hover:from-indigo-600 hover:to-purple-600"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </footer>
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