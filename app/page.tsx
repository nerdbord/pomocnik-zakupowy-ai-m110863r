"use client";

import { useSession } from "next-auth/react";
import { AuthDialog } from "@/components/AuthDialog";
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {session?.user?.name ||
      localStorage.getItem("authDialogOpened") === "true" ? null : (
        <AuthDialog />
      )}
      <Header />
      <ChatInterface />
    </div>
  );
}
