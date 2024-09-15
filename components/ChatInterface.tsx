"use client";

import { useState, useRef, useEffect } from "react";
import { readStreamableValue } from "ai/rsc";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getInitials } from "@/helpers/helpers";
import { categories } from "@/helpers/categoryData";

import { Message, continueConversation } from "@/app/actions";
import ShoppyLoader from "./ShoppyLoader";

interface Item {
  title: string;
  image: string;
  price: string;
  url: string;
}

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  useEffect(() => {
    setConversation([
      {
        role: "assistant",
        content:
          "Dzień dobry! Jestem Twoim asystentem zakupowym. Co chciałbyś kupić?",
      },
    ]);
  }, []);

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
        if (textContent[0] !== "'") {
          setConversation((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...assistantMessage,
              content: textContent,
            };

            return updatedMessages;
          });
        }
      }

      if (textContent[0] === "'") {
        setConversation((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...assistantMessage,
            content: textContent.replaceAll("'", ""),
          };

          return updatedMessages;
        });

        setIsItemsLoading(true);
        setShowItems(true);
        getItems(textContent.replaceAll("'", "")).then((fetchedItems) => {
          setItems(fetchedItems);
          setIsItemsLoading(false);
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

  const handleCategorySelect = (category: string) => {
    handleSubmit(category);
  };

  const handleNewChat = () => {
    setConversation([
      {
        role: "assistant",
        content:
          "Dzień dobry! Jestem Twoim asystentem zakupowym. Co chciałbyś kupić?",
      },
    ]);
    setShowItems(false);
    setItems([]);
  };

  const getItems = async (query: string) => {
    try {
      const res = await axios.get(
        `https://shoppy-ai-assistant-backend.onrender.com/?query=${query}`
      );

      return res.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center p-4">
      <motion.div
        className="w-full h-[calc(100vh-8rem)] flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
          initial={{ width: "100%" }}
          animate={{ width: showItems ? "33.333%" : "50%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <main className="flex-grow overflow-auto p-6">
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
              {conversation.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap justify-center gap-2 mx-auto"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-4">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="p-2 bg-white text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-800"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </main>
          <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
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
              <Button
                type="button"
                onClick={handleNewChat}
                className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MessageSquarePlus className="h-6 w-6 mb-1" />
                <span className="text-xs">Nowy chat</span>
              </Button>
            </form>
          </footer>
        </motion.div>
        <AnimatePresence>
          {showItems && (
            <motion.div
              className="ml-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-scroll flex flex-col"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "66.666%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="p-6 h-full">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Wyniki wyszukiwania
                </h2>
                {isItemsLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <ShoppyLoader />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 overflow-y-scroll">
                    {items.length > 0 ? (
                      items.map((item, i) => (
                        <motion.div
                          key={i}
                          className="bg-gray-100 dark:bg-gray-700 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col justify-between h-full p-4  hover:shadow-xl dark:hover:shadow-gray-700 transition-all duration-200"
                          >
                            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                              {item.title}
                            </p>
                            <div>
                              <img
                                src={item.image}
                                alt={item.title}
                                width={500}
                                height={500}
                                className="rounded-lg"
                              />
                              <p className="font-semibold text-xl text-indigo-500 mt-2">
                                {item.price} zł
                              </p>
                            </div>
                          </a>
                        </motion.div>
                      ))
                    ) : (
                      <div className="">
                        <p className="text-gray-700 dark:text-gray-200">
                          Brak wyników
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
