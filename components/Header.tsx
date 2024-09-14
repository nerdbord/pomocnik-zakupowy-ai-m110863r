import { Sun, Moon, ShoppingBag } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getInitials } from "@/helpers/helpers";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
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
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full text-primary-foreground hover: hover:bg-opacity-10 mr-2"
        >
          <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {session?.user?.name ? (
          <Avatar className="cursor-pointer" onClick={() => signOut()}>
            <AvatarImage src={session?.user?.image ?? ""} alt="avatar" />
            <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
          </Avatar>
        ) : (
          <Button
            onClick={() => signIn()}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-6 py-2 font-semibold transition-all duration-200 hover:from-indigo-600 hover:to-purple-600"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
