"use client";

import { Code } from "lucide-react";
import { ReactNode } from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaVuejs, FaAngular, FaNodeJs, FaPython, FaJava, FaDocker, FaGit, FaJenkins, FaBootstrap } from 'react-icons/fa';
import { SiDjango, SiFlask, SiTailwindcss, SiSpring } from 'react-icons/si';

// Map skills to lucide icons
const skillIcons: Record<string, ReactNode> = {
HTML: <FaHtml5 size={24} />,
  CSS: <FaCss3Alt size={24} />,
  JavaScript: <FaJs size={24} />,
  React: <FaReact size={24} />,
  Vue: <FaVuejs size={24} />,
  Angular: <FaAngular size={24} />,
  'Next.js': <FaReact size={24} />, // Use React icon as placeholder
  Node: <FaNodeJs size={24} />,
  Python: <FaPython size={24} />,
  Django: <SiDjango size={24} />,
  Flask: <SiFlask size={24} />,
  Java: <FaJava size={24} />,
  Spring: <SiSpring size={24} />,
  Docker: <FaDocker size={24} />,
  Git: <FaGit size={24} />,
  Jenkins: <FaJenkins size={24} />,
  Tailwind: <SiTailwindcss size={24} />,
  Bootstrap: <FaBootstrap size={24} />,
};

interface SkillIconsProps {
  skills: string[];
}

export default function SkillIcons({ skills }: SkillIconsProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
      {skills.map((skill, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center p-2 rounded-lg border shadow-sm bg-muted/40 hover:bg-muted transition"
        >
          {skillIcons[skill] || <Code size={28} />}
          <span className="mt-2 text-sm font-medium text-center">{skill}</span>
        </div>
      ))}
    </div>
  );
}
