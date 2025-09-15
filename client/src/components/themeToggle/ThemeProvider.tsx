"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"       // Adds `class="dark"` to <html>
      defaultTheme="system"   // Start with system preference
      enableSystem            // Listen for system changes
      disableTransitionOnChange // Prevents flicker
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
