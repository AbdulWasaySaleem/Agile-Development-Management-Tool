"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import {
  Home,
  FolderKanban,
  Users,
  FileText,
  Mail,
  ClipboardList,
  BarChart,
  User,
  Settings,
} from "lucide-react";

const links = [
  { key: "home", icon: Home, label: "Home", path: "/home" },
  {
    key: "projects",
    icon: FolderKanban,
    label: "Projects",
    path: "/adminProjects",
  },
  {key:"tasks", icon: ClipboardList, label: "Tasks", path: "/tasks"},
  { key: "employees", icon: Users, label: "Employees", path: "/employees" },
  {
    key: "pending-request",
    icon: FileText,
    label: "Pending Request",
    path: "/pending-requests",
  },
  { key: "messages", icon: Mail, label: "Messages", path: "/messages" },
  { key: "reports", icon: BarChart, label: "Reports", path: "/reports" },
  { key: "profile", icon: User, label: "Profile", path: "/profilepage" },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Close mobile menu when clicking outside (on overlay)
  const handleOverlayClick = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 z-50",
          // Desktop styles
          "hidden lg:flex lg:static",
          collapsed ? "lg:w-16" : "lg:w-64",
          // Mobile styles
          "lg:translate-x-0",
          mobileOpen
            ? "fixed left-0 top-0 w-64 flex"
            : "fixed -left-64 top-0 w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2
            className={cn(
              "font-semibold text-lg transition-opacity duration-300",
              collapsed ? "lg:opacity-0 lg:hidden" : "opacity-100"
            )}
          >
            Agile Development
          </h2>

          {/* Desktop Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700 p-2 hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <TooltipProvider delayDuration={300}>
            <ul className="space-y-1">
              {links.map(({ key, icon: Icon, label, path }) => {
                const isActive = pathname === path || pathname.startsWith(path + "/");

                return (
                  <li key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={path}
                          className={cn(
                            "flex items-center p-3 rounded-lg transition-all duration-200 group",
                            "hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600",
                            collapsed ? "lg:justify-center lg:px-3" : "",
                            isActive
                              ? "bg-gray-700 text-white"
                              : "text-gray-300 hover:text-white"
                          )}
                          onClick={() => {
                            // Auto-close mobile menu when link is clicked
                            if (window.innerWidth < 1024) {
                              setMobileOpen(false);
                            }
                          }}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-white"
                            )}
                          />
                          <span
                            className={cn(
                              "ml-3 transition-opacity duration-300 font-medium",
                              collapsed
                                ? "lg:opacity-0 lg:w-0 lg:hidden"
                                : "opacity-100"
                            )}
                          >
                            {label}
                          </span>
                          {isActive && (
                            <div
                              className={cn(
                                "ml-auto w-2 h-2 bg-blue-400 rounded-full",
                                collapsed ? "lg:hidden" : ""
                              )}
                            />
                          )}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent
                          side="right"
                          className="lg:block hidden"
                        >
                          {label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>
        </nav>
      </aside>
    </>
  );
}
