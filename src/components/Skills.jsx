import {
  SiAxios,
  SiCss3,
  SiDocker,
  SiEslint,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiJirasoftware,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenlayers,
  SiPrettier,
  SiReact,
  SiReactquery,
  SiRedux,
  SiSass,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const skillGroups = [
  {
    label: "Languages",
    items: [
      { Icon: SiJavascript, name: "JavaScript" },
      { Icon: SiTypescript, name: "TypeScript" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { Icon: SiReact, name: "React" },
      { Icon: SiNextdotjs, name: "Next.js" },
      { Icon: SiRedux, name: "Redux Toolkit" },
      { Icon: SiReactquery, name: "TanStack Query" },
      { Icon: SiTailwindcss, name: "Tailwind CSS" },
      { Icon: SiSass, name: "SCSS" },
      { Icon: SiOpenlayers, name: "OpenLayers" },
      { Icon: SiVite, name: "Vite" },
      { Icon: SiHtml5, name: "HTML" },
      { Icon: SiCss3, name: "CSS" },
    ],
  },
  {
    label: "Backend & APIs",
    items: [
      { Icon: SiNodedotjs, name: "Node.js" },
      { Icon: SiExpress, name: "Express" },
      { Icon: SiMongodb, name: "MongoDB" },
      { Icon: SiAxios, name: "Axios" },
    ],
  },
  {
    label: "Tools",
    items: [
      { Icon: SiGit, name: "Git" },
      { Icon: SiGithub, name: "GitHub" },
      { Icon: SiDocker, name: "Docker" },
      { Icon: SiJest, name: "Jest" },
      { Icon: SiEslint, name: "ESLint" },
      { Icon: SiPrettier, name: "Prettier" },
      { Icon: SiJirasoftware, name: "Jira" },
    ],
  },
];

function Skills() {
  return (
    <section id="skills" className="container-page py-24 sm:py-32">
      <SectionHeader eyebrow="Skills" title="What I work with." />

      <div className="border-t border-separator">
        {skillGroups.map((group, index) => (
          <Reveal
            key={group.label}
            delay={index * 60}
            className="grid gap-4 border-b border-separator py-8 sm:grid-cols-[11rem_1fr] sm:gap-8"
          >
            <h3 className="caption font-medium">{group.label}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map(({ Icon, name }) => (
                <li
                  key={name}
                  className="caption flex items-center gap-2 rounded-full bg-label/[0.05] px-3.5 py-2"
                >
                  <Icon size={15} className="text-secondary" aria-hidden />
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Skills;
