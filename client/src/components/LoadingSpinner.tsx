"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses =
    size === "sm"
      ? "h-5 w-5 border-2"
      : size === "lg"
      ? "h-12 w-12 border-4"
      : "h-8 w-8 border-3";

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-4 border-b-4 border-blue-500",
        "border-solid border-t-transparent",
        sizeClasses,
        className
      )}
    />
  );
}
