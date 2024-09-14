"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AuthDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleSubmit = async (
    event: React.FormEvent,
    action: "login" | "register"
  ) => {
    event.preventDefault();
    if (action === "login") {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        console.error(result.error);
      } else {
        setIsOpen(false);
      }
    } else {
      // Here you would typically call an API to register the user
      console.log("Register with", email, password);
      // After successful registration, you might want to automatically sign in the user
    }
  };

  const gradientButtonClass =
    "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-6 py-2 font-semibold transition-all duration-200 hover:from-indigo-600 hover:to-purple-600";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-primary text-primary-foreground">
        <DialogHeader>
          <DialogTitle>
            Welcome to{" "}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Shoppy
            </span>
          </DialogTitle>
          <DialogDescription>
            Login or create an account to get started
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={(e) => handleSubmit(e, "login")}>
              <div className="grid gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className={gradientButtonClass}>
                  Login
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={(e) => handleSubmit(e, "register")}>
              <div className="grid gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className={gradientButtonClass}>
                  Register
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </Button>
        <DialogTrigger asChild>
          <Button variant="link" className="mt-2 text-primary-foreground">
            Continue without account
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
