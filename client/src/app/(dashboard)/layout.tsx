"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import DevBanner from "@/components/common/DevBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else {
        setTimeout(() => setIsLoading(false), 400);
      }
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Loading screen - simpler, less flashy
  if (!hasHydrated || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner
            size="lg"
            className="text-blue-600 dark:text-blue-400"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

 return (
  <>
    <DevBanner />
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  </>
);


}
