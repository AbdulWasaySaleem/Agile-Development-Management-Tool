import React from 'react';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaVuejs, FaAngular, FaNodeJs, FaPython, FaJava, FaDocker, FaGit, FaJenkins, FaBootstrap } from 'react-icons/fa';
import { SiDjango, SiFlask, SiTailwindcss, SiSpring } from 'react-icons/si';

// Map skills to their icons
const skillIcons = {
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

const SkillIcons = ({ skills }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {skills.map((skill, index) => (
        <div key={index} className="w-12 h-12 flex items-center justify-center">
          {skillIcons[skill] || <span>{skill}</span>}
        </div>
      ))}
    </div>
  );
};

export default SkillIcons;
