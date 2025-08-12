import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./Context/UserContext";
import {
  LogOut,
  Home,
  FolderOpen,
  Users,
  Clock,
  MessageSquare,
  CheckSquare,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../assets/logo.jpg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar({ collapsed }) {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = auth.user?.role || "";
  const user = auth.user;

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

  // Updated links with Lucide React icons
  const links = {
    admin: [
      { key: "home", label: "Dashboard", path: "/", icon: Home },
      {
        key: "projects",
        label: "Projects",
        path: "/adminProjects",
        icon: FolderOpen,
      },
      { key: "employees", label: "Employees", path: "/employees", icon: Users },
      {
        key: "pending-request",
        label: "Pending Requests",
        path: "/pendingrequest",
        icon: Clock,
      },
      {
        key: "messages",
        label: "Messages",
        path: "/messages",
        icon: MessageSquare,
      },
      { key: "tasks", label: "Tasks", path: "/tasks", icon: CheckSquare },
      { key: "reports", label: "Reports", path: "/reports", icon: BarChart3 },
      { key: "profile", label: "Profile", path: "/profilepage", icon: User },
      { key: "settings", label: "Settings", path: "/settings", icon: Settings },
    ],
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl">
      {/* Header */}
      <div
        className={`flex items-center gap-3 p-4 border-b border-slate-700 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-lg object-cover"
          />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <p className="font-bold text-lg leading-tight">Agile Dev</p>
            <p className="text-xs text-slate-300">Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <TooltipProvider delayDuration={0}>
          {links[role]?.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            const linkContent = (
              <Link
                key={link.key}
                to={link.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  hover:bg-white/10 hover:translate-x-1 hover:shadow-lg
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                      : "text-slate-300 hover:text-white"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon
                  className={`flex-shrink-0 ${
                    collapsed ? "w-6 h-6" : "w-5 h-5"
                  }`}
                />
                {!collapsed && (
                  <span className="font-medium text-sm truncate">
                    {link.label}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={link.key}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {link.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 space-y-2">
        {/* Collapse Toggle - Desktop only */}
        <div className="hidden lg:block">
          <TooltipProvider>
            <Tooltip>
              {collapsed && (
                <TooltipContent side="right">Expand Sidebar</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Logout Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className={`w-full bg-red-600 hover:bg-red-700 ${
                  collapsed ? "px-3" : ""
                }`}
              >
                <LogOut
                  className={`${collapsed ? "w-4 h-4" : "w-4 h-4 mr-2"}`}
                />
                {!collapsed && "Logout"}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
        hidden lg:flex lg:flex-col fixed left-0 top-0 h-full z-40
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
      `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
