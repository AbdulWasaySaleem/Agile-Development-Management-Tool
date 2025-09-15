"use client";

import { ThemeToggle } from "./themeToggle/ThemeToggle";
import { Button } from "./ui/button";
import { Menu, X, LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function Navbar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // fake delay for UX
      logout();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-background text-foreground flex items-center justify-between p-4 sticky top-0 z-40 shadow-sm border-b">
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-secondary p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* App Title */}
      <div className="text-left flex-1 lg:flex-none lg:ml-0 ml-4">
        <h1 className="text-lg font-bold">Agile Development</h1>
        <p className="text-xs text-muted-foreground">
          Project Management System
        </p>
      </div>

      {/* Right side elements */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Section */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer select-none">
                {/* Avatar only for mobile */}
                <div className="sm:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.pic} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Full profile for larger screens */}
                <div className="hidden sm:flex items-center space-x-2 bg-secondary/40 px-3 py-1 rounded-full hover:bg-secondary/60 transition-all">
                  <Avatar className="h-8 w-8 ring-2 ring-border">
                    <AvatarImage src={user.pic} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 shadow-lg border rounded-xl p-1"
            >
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/profilepage")}
                className="gap-2"
              >
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="gap-2"
              >
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-red-600 focus:text-red-600"
              >
                {loading ? <LoadingSpinner /> : <LogOut className="h-4 w-4" />}
                {loading ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
