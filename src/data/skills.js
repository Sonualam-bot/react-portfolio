// Every skill floats on the chart as a buoy; `color` tints its lamp.
export const skillGroups = [
  {
    label: "Languages",
    items: [
      { name: "JavaScript", color: "#f0d33a" },
      { name: "TypeScript", color: "#4a90e2" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", color: "#5ed3f3" },
      { name: "Next.js", color: "#e8eef2" },
      { name: "Redux Toolkit", color: "#9a6cdc" },
      { name: "TanStack Query", color: "#ff5a6a" },
      { name: "Tailwind CSS", color: "#38bdf8" },
      { name: "SCSS", color: "#e27fb4" },
      { name: "OpenLayers", color: "#4fb3bf" },
      { name: "Vite", color: "#8f93ff" },
      { name: "HTML", color: "#f26b3a" },
      { name: "CSS", color: "#3b8fd9" },
    ],
  },
  {
    label: "Backend & APIs",
    items: [
      { name: "Node.js", color: "#7cc35f" },
      { name: "Express", color: "#d9dde0" },
      { name: "MongoDB", color: "#5dbb5a" },
      { name: "Axios", color: "#8a5cf6" },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", color: "#f4704f" },
      { name: "GitHub", color: "#f0f3f5" },
      { name: "Docker", color: "#3aa7f5" },
      { name: "Jest", color: "#e04b5a" },
      { name: "ESLint", color: "#7b6be0" },
      { name: "Prettier", color: "#f5c04a" },
      { name: "Jira", color: "#3b82f6" },
    ],
  },
];

export const allSkills = skillGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label }))
);
