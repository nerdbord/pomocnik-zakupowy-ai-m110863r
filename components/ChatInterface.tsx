import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MessageSquarePlus, X } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getInitials } from "@/helpers/helpers";
import { categories, Category, subcategories, questionsBySubcategory } from "@/helpers/categoryData";

import { Message } from "@/app/actions";

// Dodajmy pytania dla kategorii "Inne"
const generalQuestions = [
  "Ile pieniędzy chciałbyś wydać na ten produkt?",
  "Czy chciałbyś go kupić z jakiegoś konkretnego sklepu?",
  "Jak szybko potrzebujesz tego produktu?",

];

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Message[]>([
    { role: "assistant", content: "Dzień dobry! Jestem Twoim asystentem zakupowym. Co chciałbyś kupić?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setConversation(prev => [...prev, { role: "user", content: category }]);
    if (category === "Inne") {
      setIsOtherCategory(true);
      handleOtherCategory();
    } else {
      setIsOtherCategory(false);
      setShowCategories(false);
      setShowSubcategories(true);
    }
  };

  const handleOtherCategory = () => {
    setShowCategories(false);
    setConversation(prev => [
      ...prev,
      { role: "assistant", content: "Rozumiem, że szukasz czegoś spoza standardowych kategorii. Napisz nazwę produktu, który potrzebujesz." },
      { role: "assistant", content: generalQuestions[0] }
    ]);
    setCurrentQuestionIndex(0);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setConversation(prev => [
      ...prev,
      { role: "user", content: subcategory },
      { role: "assistant", content: "Dziękuję! Cieszę się, że mogę pomóc. Aby upewnić się, że znajdziemy dokładnie to, czego potrzebujesz, chciałbym dowiedzieć się więcej o Twoich preferencjach." }
    ]);
    setShowSubcategories(false);
    setShowQuestions(true);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(prev => prev.filter(item => item !== option));
    } else {
      setSelectedOptions(prev => [...prev, option]);
    }
  };

  const handleSubmit = async () => {
    if ((!selectedOptions.length && !input.trim()) || isLoading) return;

    setIsLoading(true);
    const messageContent = [...selectedOptions, input].filter(Boolean).join(", ");
    const userMessage: Message = { role: "user", content: messageContent };
    setConversation(prev => [...prev, userMessage]);
    setSelectedOptions([]);
    setInput("");

    if (isOtherCategory && currentQuestionIndex < generalQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setConversation(prev => [...prev, { role: "assistant", content: generalQuestions[currentQuestionIndex + 1] }]);
      setIsLoading(false);
    } else {
      setShowQuestions(false);
      // Symulacja odpowiedzi asystenta (zastąp to rzeczywistym wywołaniem API)
      setTimeout(() => {
        const assistantMessage: Message = {
          role: "assistant",
          content: `Dziękuję za podanie informacji: ${messageContent}. Na podstawie tych danych, mogę zaproponować następujące produkty...`
        };
        setConversation(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleNewChat = () => {
    setConversation([{ role: "assistant", content: "Dzień dobry! Jestem Twoim asystentem zakupowym. Co chciałbyś kupić?" }]);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setShowCategories(true);
    setShowSubcategories(false);
    setShowQuestions(false);
    setSelectedOptions([]);
    setInput("");
    setIsOtherCategory(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      <main className="flex-grow overflow-auto p-6">
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
        {showCategories && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Kategorie:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="p-2 bg-white text-gray-800 hover:bg-indigo-100"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
        {showSubcategories && selectedCategory && selectedCategory !== "Inne" && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Podkategorie:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {subcategories[selectedCategory].map((subcategory) => (
                <Button
                  key={subcategory}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className="p-2 bg-white text-gray-800 hover:bg-purple-100"
                >
                  {subcategory}
                </Button>
              ))}
            </div>
          </div>
        )}
        {/* {showSubcategories && selectedCategory && !isOtherCategory && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Podkategorie:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {subcategories[selectedCategory].map((subcategory) => (
                <Button
                  key={subcategory}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className="p-2 bg-white text-gray-800 hover:bg-purple-100"
                >
                  {subcategory}
                </Button>
              ))}
            </div>
          </div>
        )} */}
        {showQuestions && selectedSubcategory && !isOtherCategory && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Preferencje:</h3>
            {Object.entries(questionsBySubcategory[selectedSubcategory]).map(([questionType, question]) => (
              <div key={questionType} className="mb-4">
                <h4 className="font-medium mb-2">{question.question}</h4>
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option: string) => (
                    <Button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`p-2 ${selectedOptions.includes(option)
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-800 hover:bg-indigo-100"
                        }`}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center space-x-2"
        >
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {selectedOptions.map((option) => (
                <span key={option} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm mr-1">
                  {option}
                </span>
              ))}
            </div>
            <Input
              type="text"
              placeholder={selectedOptions.length > 0 ? "" : "Wpisz swoją wiadomość..."}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              className={`w-full text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${selectedOptions.length > 0 ? 'pl-32' : 'pl-3'
                }`}
            />
            {selectedOptions.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedOptions([])}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
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
            <span className="text-xs">New Chat</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}