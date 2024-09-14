import { useState, useRef, useEffect } from "react";
import { readStreamableValue } from "ai/rsc";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getInitials } from "@/helpers/helpers";

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
    className="m-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: "user", content: input };
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

  const handleOptionSelect = (option: string) => {
    setInput(option);
    handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  };

  return (
    <>
      <main className="flex-grow overflow-auto p-4 lg:w-[40rem] mx-auto my-2">
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
                  <AvatarFallback>
                    {message.role === "user"
                      ? getInitials(session?.user?.name ?? "User")
                      : "S"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 py-3 px-4 rounded-lg ${
                    message.role === "user"
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
              <OptionTile
                key={index}
                option={option}
                onSelect={handleOptionSelect}
              />
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
    </>
  );
}
