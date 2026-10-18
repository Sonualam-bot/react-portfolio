import { FiExternalLink, FiFileText, FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import PortraitImg from "../assets/Renon.jpeg";
import { RESUME_URL, socialLinks } from "../data/profile";
import { skillGroups } from "../data/skills";
import { pois } from "../game/world";
import { skillIcons } from "./skillIcons";

const socialIcons = { GitHub: FiGithub, LinkedIn: FiLinkedin, X: FaXTwitter };

export function About() {
  return (
    <div className="about">
      <img src={PortraitImg} alt="Portrait of Md Sonu Alam" width="535" height="798" className="about-photo" />
      <div className="about-body">
        <dl className="specs">
          <div>
            <dt>Role</dt>
            <dd>Software Engineer</dd>
          </div>
          <div>
            <dt>Ship</dt>
            <dd>RekiSe Marine Pvt Ltd</dd>
          </div>
          <div>
            <dt>Home port</dt>
            <dd>Bengaluru, India</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>React, TypeScript, OpenLayers</dd>
          </div>
        </dl>
        <p>
          I&apos;m a software engineer with close to two years of experience building
          React and TypeScript applications in a startup. At RekiSe Marine I work on
          GIS-based marine monitoring and mission planning: interactive maps,
          real-time telemetry dashboards, and the reusable component library the rest
          of the product is built on.
        </p>
        <p>
          I care about component architecture, clean API integration, and frontend
          performance, the details that keep an application reliable as it grows.
        </p>
        <Links />
      </div>
    </div>
  );
}

export function Links() {
  return (
    <ul className="links">
      {socialLinks.map(({ label, href }) => {
        const Icon = socialIcons[label];
        return (
          <li key={label}>
            <a href={href} target="_blank" rel="noreferrer" className="chip">
              <Icon aria-hidden /> {label}
            </a>
          </li>
        );
      })}
      <li>
        <a href={RESUME_URL} target="_blank" rel="noreferrer" className="chip chip-strong">
          <FiFileText aria-hidden /> Résumé
        </a>
      </li>
    </ul>
  );
}

export function Project({ project, compact = false }) {
  const isApi = project.tag === "api";
  return (
    <article className={`project ${compact ? "is-compact" : ""}`}>
      <img src={project.img} alt="" className="project-img" loading="lazy" />
      <div className="project-body">
        <p>{project.techStack}</p>
        <div className="project-links">
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn btn-ink">
              <FiExternalLink aria-hidden /> {isApi ? "API docs" : "Live site"}
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-ghost-ink">
              <FiGithub aria-hidden /> Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export const careerPois = pois.filter((p) => p.kind === "lighthouse");

export function Timeline({ activeId }) {
  return (
    <ol className="timeline">
      {[...careerPois].reverse().map((p) => (
        <li key={p.id} className={p.id === activeId ? "is-active" : undefined}>
          <span className="timeline-year">{p.job.year}</span>
          <div>
            <h3>{p.job.title}</h3>
            <p className="timeline-meta">
              {[p.job.company, p.job.duration].filter(Boolean).join(" · ")}
            </p>
            <p>{p.job.details}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Skills({ collected }) {
  return (
    <div className="skills">
      {skillGroups.map((group) => (
        <section key={group.label}>
          <h3>{group.label}</h3>
          <ul>
            {group.items.map(({ name, color }) => {
              const Icon = skillIcons[name];
              const have = !collected || collected.includes(name);
              return (
                <li key={name} className={have ? "is-have" : "is-missing"} style={{ "--skill": color }}>
                  <Icon aria-hidden />
                  <span>{name}</span>
                  {!have && <span className="sr-only">(not collected yet)</span>}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
