"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Code, Database, Github, Info, Zap, X } from "lucide-react";

// Reusable Section component
const Section = ({
  title,
  color,
  items,
  icon: Icon,
}: {
  title: string;
  color: "blue" | "green" | "purple";
  items: string[];
  icon: any;
}) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  };

  const headingClasses: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`${headingClasses[color]} w-5 h-5`} />
        <h3 className={`font-semibold text-lg ${headingClasses[color]}`}>
          {title}
        </h3>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`text-xs sm:text-sm px-3 py-1 rounded-full shadow-sm ${colorClasses[color]} hover:opacity-80 transition`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DevBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {/* Top banner */}
      {showBanner && (
        <div className="relative bg-blue-600 dark:bg-blue-800 text-white text-xs sm:text-sm py-2 px-4 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2 shadow">
          <span>
            ⚠️ This is a <strong>practice/demo Project</strong> — built for
            learning purposes only. Best viewed on desktop.
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/abdul-wasay-4765b82a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-200"
            >
              Contact me
            </a>
            <p>for more details or</p>
            <Button
              onClick={() => setIsOpen(true)}
              size="sm"
              variant="secondary"
              className="h-7 px-3 text-xs font-medium shadow"
            >
              <Info className="w-3 h-3 mr-1" /> read about this project
            </Button>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-3 top-2 text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dialog modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              About This Project
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Intro */}
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong className="text-blue-600 dark:text-blue-400">
                Agile Development Management Tool 🚀
              </strong>{" "}
              is a full-stack application designed to help software teams
              collaborate better. It integrates <strong>Kanban</strong>,{" "}
              <strong>Scrum</strong>, and{" "}
              <strong>Extreme Programming (XP)</strong> for flexibility and
              efficient tracking.
            </p>

            {/* Tech Sections */}
            <div className="space-y-6">
              <Section
                color="blue"
                title="Frontend"
                icon={Code}
                items={[
                  "Next.js",
                  "Tailwind CSS",
                  "shadcn/ui",
                  "Lucide React",
                  "TanStack Query",
                  "Axios",
                  "Zustand",
                  "react-beautiful-dnd",
                  "socket.io-client",
                  "zod",
                  "react-hook-form",
                ]}
              />
              <Section
                color="green"
                title="Backend"
                icon={Database}
                items={["Node.js", "Express.js", "MongoDB", "Socket.IO"]}
              />
              <Section
                color="purple"
                title="Key Technologies"
                icon={Zap}
                items={["JWT Authentication", "Multer", "Cloudinary"]}
              />
            </div>

            {/* Footer note */}
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
              ⚠️ This project is for <strong>learning</strong> and{" "}
              <strong>practice</strong> purposes only — not production use.
            </p>
          </div>

          {/* GitHub CTA */}
          <div className="mt-6 flex justify-center">
            <a
              href="https://github.com/AbdulWasaySaleem/Agile-Development-Management-Tool"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DevBanner;
