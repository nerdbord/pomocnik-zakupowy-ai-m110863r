import { useState, useRef, useEffect } from "react";
import { readStreamableValue } from "ai/rsc";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getInitials } from "@/helpers/helpers";
import { categories } from "@/helpers/categoryData";

import { Message, continueConversation } from "@/app/actions";

const OptionTile = ({
  option,
  onSelect,
}: {
  option: string;
  onSelect: (option: string) => void;
}) => (
  <Button
    onClick={() => onSelect(option)}
    className="m-1 bg-indigo-500 text-white hover:bg-indigo-600"
  >
    {option}
  </Button>
);

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const { data: session } = useSession();

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
          const newOptions = optionsMatch[1]
            .split(",")
            .map((option) => option.trim());
          console.log("Parsed options:", newOptions);
          setOptions(newOptions);
          textContent = textContent.replace(/OPTIONS:\s*\[.*?\]/, "").trim();
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
    <div className="flex-grow flex justify-center items-center p-4">
      <div
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
        style={{ height: "calc(100vh - 8rem)" }}
      >
        <main className="flex-grow overflow-auto p-6">
          <div className="mb-6">
            <p className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
              Dzień dobry! Jestem Twoim asystentem zakupowym. Co chciałbyś
              kupić?
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
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex items-end ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    {message.role === "user" && (
                      <AvatarImage
                        src={session?.user?.image ?? ""}
                        alt="avatar"
                      />
                    )}
                    <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      {message.role === "user"
                        ? getInitials(session?.user?.name ?? "User")
                        : "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 py-2 px-3 rounded-lg ${
                      message.role === "user"
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
                <OptionTile
                  key={index}
                  option={option}
                  onSelect={handleOptionSelect}
                />
              ))}
            </div>
          )}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center space-x-2 lg:max-w-[40rem] mx-auto"
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
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-6 py-2 font-semibold transition-all duration-200 hover:from-indigo-600 hover:to-purple-600"
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
  );
}
