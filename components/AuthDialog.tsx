"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AuthDialog() {
  const [isOpen, setIsOpen] = useState(true);

  const onOpenChange = () => {
    setIsOpen((prev) => !prev);
    localStorage.setItem("authDialogOpened", "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-primary text-primary-foreground">
        <DialogHeader>
          <DialogTitle>
            Welcome to{" "}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Shoppy
            </span>
          </DialogTitle>
        </DialogHeader>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </Button>
        <span className="block text-center mt-4">or</span>
        <DialogTrigger asChild>
          <Button variant="link" className="mt-2 text-primary-foreground">
            Continue without account
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
