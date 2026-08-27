import HTML from "../assets/html.png";
import CSS from "../assets/css.png";
import Javascript from "../assets/javascript.png";
import React from "../assets/react.png";
import Mongo from "../assets/mongo.png";
import Node from "../assets/node.png";
import Tailwind from "../assets/tailwind.png";
import {
  SiTypescript,
  SiNextdotjs,
  SiRedux,
  SiReactquery,
  SiSass,
  SiOpenlayers,
  SiVite,
  SiExpress,
  SiAxios,
  SiGit,
  SiGithub,
  SiDocker,
  SiJest,
  SiEslint,
  SiPrettier,
  SiJirasoftware,
} from "react-icons/si";

const skillGroups = [
  {
    label: "Languages",
    items: [
      { icon: Javascript, tag: "JavaScript" },
      { Icon: SiTypescript, tag: "TypeScript", color: "#3178c6" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { icon: React, tag: "React" },
      { Icon: SiNextdotjs, tag: "Next.js", color: "#000000" },
      { Icon: SiRedux, tag: "Redux Toolkit", color: "#764abc" },
      { Icon: SiReactquery, tag: "TanStack Query", color: "#ff4154" },
      { icon: Tailwind, tag: "Tailwind CSS" },
      { Icon: SiSass, tag: "SCSS", color: "#cc6699" },
      { Icon: SiOpenlayers, tag: "OpenLayers", color: "#1f6b75" },
      { Icon: SiVite, tag: "Vite", color: "#646cff" },
      { icon: HTML, tag: "HTML5" },
      { icon: CSS, tag: "CSS3" },
    ],
  },
  {
    label: "Backend & APIs",
    items: [
      { icon: Node, tag: "Node.js" },
      { Icon: SiExpress, tag: "Express.js", color: "#000000" },
      { icon: Mongo, tag: "MongoDB" },
      { Icon: SiAxios, tag: "Axios", color: "#5a29e4" },
    ],
  },
  {
    label: "Tools",
    items: [
      { Icon: SiGit, tag: "Git", color: "#f05032" },
      { Icon: SiGithub, tag: "GitHub", color: "#181717" },
      { Icon: SiDocker, tag: "Docker", color: "#2496ed" },
      { Icon: SiJest, tag: "Jest", color: "#c21325" },
      { Icon: SiEslint, tag: "ESLint", color: "#4b32c3" },
      { Icon: SiPrettier, tag: "Prettier", color: "#f7b93e" },
      { Icon: SiJirasoftware, tag: "Jira", color: "#0052cc" },
    ],
  },
];

function SkillTile({ skill }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 transition-colors duration-300 hover:border-teal-600/50 hover:shadow-sm">
      {skill.Icon ? (
        <skill.Icon className="mx-auto" size={36} color={skill.color} />
      ) : (
        <img className="w-9 mx-auto" src={skill.icon} alt={skill.tag} />
      )}
      <p className="mt-3 text-stone-600 text-xs sm:text-sm">{skill.tag}</p>
    </div>
  );
}

function Skills() {
  return (
    <div id="skills" className="max-w-[1040px] m-auto md:pl-20 px-4 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-center text-stone-900">
        Skills
      </h1>
      <div className="w-20 m-auto h-1 rounded-lg bg-teal-600 mt-2 mb-10"></div>

      <div className="flex flex-col gap-8">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400 mb-3">
              {group.label}
            </p>
            <div className="w-full grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
              {group.items.map((skill) => (
                <SkillTile key={skill.tag} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;
