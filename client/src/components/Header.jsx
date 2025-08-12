import { Bell, User, Menu, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "./Context/UserContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ onToggleSidebar }) {
  const [auth] = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = auth?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side - Mobile menu + Desktop sidebar toggle + Title */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button - only visible on mobile */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <MobileSidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop sidebar toggle - only visible on desktop */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="hidden lg:flex h-9 w-9"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="flex flex-col">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Agile Development
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Project Management System
            </p>
          </div>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search projects, tasks..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              5
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 px-2 py-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {user?.pic ? (
                      <AvatarImage src={user.pic} alt={user?.name || "User"} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user?.role || "Role"}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <a href="/profilepage" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/settings" className="cursor-pointer">
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

// Mobile sidebar content component
function MobileSidebarContent() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const role = auth.user?.role || "";

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/v1/auth/logout");
      toast.info(data.message);
      if (data.success) {
        setAuth({ user: null, token: "", role: "" });
        localStorage.removeItem("auth");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error on logout", error.message);
    }
  };

  // Import the same links structure from your sidebar
  const links = {
    admin: [
      { key: "home", label: "Home", path: "/" },
      { key: "projects", label: "Projects", path: "/adminProjects" },
      { key: "employees", label: "Employees", path: "/employees" },
      { key: "pending-request", label: "Pending Request", path: "/pendingrequest" },
      { key: "messages", label: "Messages", path: "/messages" },
      { key: "tasks", label: "Tasks", path: "/tasks" },
      { key: "reports", label: "Reports", path: "/reports" },
      { key: "profile", label: "Profile", path: "/profilepage" },
      { key: "settings", label: "Settings", path: "/settings" },
    ],
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Mobile sidebar content - implement similar to your current sidebar */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Navigation</h2>
      </div>
      {/* Add your navigation items here */}
    </div>
  );
}