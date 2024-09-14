"use client";

import { useState, useRef, useEffect } from "react";
import { Message, continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, MoonIcon, ShoppingBag } from "lucide-react";

export default function ChatInterface() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

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

      // Add a placeholder for the assistant's message
      setConversation((prev) => [...prev, assistantMessage]);

      for await (const delta of readStreamableValue(newMessage)) {
        textContent += delta;

        // Update the content of the assistant's message directly
        setConversation((prev) => {
          const updatedMessages = [...prev];
          // Update the last message (the assistant's message)
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

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? "dark" : ""}`}>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full shadow-lg transform -skew-x-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-400 dark:to-violet-400">
            SHOPPY
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-indigo-500 dark:hover:bg-indigo-700 transition-colors duration-200"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
      </header>
      <div className="flex-grow overflow-auto p-4 bg-gray-100 dark:bg-gray-800">
        <AnimatePresence>
          {conversation.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    : "bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 dark:focus:ring-indigo-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Thinking...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
