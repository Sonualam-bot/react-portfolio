import { Fragment, useState } from "react";
import {
  SiAxios, SiCss3, SiDocker, SiEslint, SiExpress, SiGit, SiGithub, SiHtml5,
  SiJavascript, SiJest, SiJirasoftware, SiMongodb, SiNextdotjs, SiNodedotjs,
  SiOpenlayers, SiPrettier, SiReact, SiReactquery, SiRedux, SiSass,
  SiTailwindcss, SiTypescript, SiVite,
} from "react-icons/si";
import { useOS } from "../OSContext";
import { DiscIcon } from "../icons";

const skillGroups = [
  {
    label: "Languages",
    items: [
      { Icon: SiJavascript, name: "JavaScript", color: "#c9a800" },
      { Icon: SiTypescript, name: "TypeScript", color: "#3178c6" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { Icon: SiReact, name: "React", color: "#149eca" },
      { Icon: SiNextdotjs, name: "Next.js", color: "#000" },
      { Icon: SiRedux, name: "Redux Toolkit", color: "#764abc" },
      { Icon: SiReactquery, name: "TanStack Query", color: "#ff4154" },
      { Icon: SiTailwindcss, name: "Tailwind CSS", color: "#0ea5e9" },
      { Icon: SiSass, name: "SCSS", color: "#cc6699" },
      { Icon: SiOpenlayers, name: "OpenLayers", color: "#1f6b75" },
      { Icon: SiVite, name: "Vite", color: "#646cff" },
      { Icon: SiHtml5, name: "HTML", color: "#e34f26" },
      { Icon: SiCss3, name: "CSS", color: "#1572b6" },
    ],
  },
  {
    label: "Backend & APIs",
    items: [
      { Icon: SiNodedotjs, name: "Node.js", color: "#5fa04e" },
      { Icon: SiExpress, name: "Express", color: "#000" },
      { Icon: SiMongodb, name: "MongoDB", color: "#47a248" },
      { Icon: SiAxios, name: "Axios", color: "#5a29e4" },
    ],
  },
  {
    label: "Tools",
    items: [
      { Icon: SiGit, name: "Git", color: "#f05032" },
      { Icon: SiGithub, name: "GitHub", color: "#000" },
      { Icon: SiDocker, name: "Docker", color: "#2496ed" },
      { Icon: SiJest, name: "Jest", color: "#c21325" },
      { Icon: SiEslint, name: "ESLint", color: "#4b32c3" },
      { Icon: SiPrettier, name: "Prettier", color: "#c08b00" },
      { Icon: SiJirasoftware, name: "Jira", color: "#0052cc" },
    ],
  },
];

const total = skillGroups.reduce((n, g) => n + g.items.length, 0);

// Skills presented as an "Add or Remove Programs" list.
function SkillsApp() {
  const { open } = useOS();
  const [selected, setSelected] = useState(null);

  const tryRemove = (name) =>
    open(
      "message",
      {
        title: "Add or Remove Programs",
        icon: "warning",
        message: `${name} can't be removed. Too many projects depend on it.`,
      },
      "message-remove"
    );

  return (
    <div className="arp">
      <div className="arp-sidebar" aria-hidden>
        <div className="arp-side-item is-active">
          <DiscIcon size={32} />
          <span>Change or Remove Programs</span>
        </div>
      </div>

      <div className="arp-main">
        <div className="arp-header">
          <span>Currently installed programs:</span>
          <span className="arp-sort">Sort by: Category</span>
        </div>
        <div className="arp-list">
          {skillGroups.map((group) => (
            <Fragment key={group.label}>
              <h3 className="arp-group">{group.label}</h3>
              <ul>
                {group.items.map(({ Icon, name, color }) => {
                  const isSelected = selected === name;
                  return (
                    <li key={name} className={`arp-row ${isSelected ? "is-selected" : ""}`}>
                      <button
                        type="button"
                        className="arp-row-button"
                        aria-expanded={isSelected}
                        onClick={() => setSelected(isSelected ? null : name)}
                      >
                        <Icon size={18} color={isSelected ? "#fff" : color} aria-hidden />
                        <span className="arp-name">{name}</span>
                        <span className="arp-meta">{group.label}</span>
                      </button>
                      {isSelected && (
                        <div className="arp-details">
                          <span>Part of the {group.label.toLowerCase()} toolkit.</span>
                          <button type="button" className="xp-btn" onClick={() => tryRemove(name)}>
                            Remove
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Fragment>
          ))}
        </div>
        <div className="statusbar">
          <span>{total} programs installed</span>
        </div>
      </div>
    </div>
  );
}

export default SkillsApp;
