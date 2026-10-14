import AboutApp from "./AboutApp";
import ExperienceApp from "./ExperienceApp";
import MailApp from "./MailApp";
import MessageBox from "./MessageBox";
import ProjectsApp from "./ProjectsApp";
import ProjectViewer from "./ProjectViewer";
import RecycleBinApp from "./RecycleBinApp";
import SkillsApp from "./SkillsApp";

// Every program the OS knows how to open. `height: null` sizes to content.
export const apps = {
  about: { title: "My Profile", icon: "profile", width: 600, height: 560, Component: AboutApp },
  projects: { title: "My Projects", icon: "folder", width: 800, height: 560, Component: ProjectsApp },
  experience: { title: "experience.txt - Notepad", icon: "notepad", width: 640, height: 520, Component: ExperienceApp },
  skills: { title: "Add or Remove Programs", icon: "disc", width: 660, height: 520, Component: SkillsApp },
  contact: { title: "New Message", icon: "mail", width: 580, height: 520, Component: MailApp },
  recycle: { title: "Recycle Bin", icon: "recycle", width: 580, height: 340, Component: RecycleBinApp },
  viewer: {
    title: ({ project }) => project.title.trim(),
    icon: ({ project }) => (project.tag === "api" ? "globe" : "picture"),
    width: 700,
    height: 580,
    Component: ProjectViewer,
  },
  message: {
    title: ({ title }) => title,
    icon: ({ icon }) => icon ?? "info",
    width: 400,
    height: null,
    resizable: false,
    Component: MessageBox,
  },
};

const resolve = (value, props) => (typeof value === "function" ? value(props) : value);
export const titleOf = (win) => resolve(apps[win.appId].title, win.props);
export const iconOf = (win) => resolve(apps[win.appId].icon, win.props);
