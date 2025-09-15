"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  console.log("isAuthenticated:", isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return null; // No UI, just redirect
}
