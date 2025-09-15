import "./globals.css";
import { ThemeProvider } from "@/components/themeToggle/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Providers from "./provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen bg-gray-50">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
