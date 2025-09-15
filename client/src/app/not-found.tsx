"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
