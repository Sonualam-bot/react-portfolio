import { useCallback, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { BackendApi, FrontEndProjects } from "./ProjectItem";
import ProjectSheet from "./ProjectSheet";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

function ProjectCard({ project, onOpen, hidden, cardRef }) {
  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="pressable group block w-full overflow-hidden rounded-[20px] bg-surface text-left shadow-card"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <span className="block overflow-hidden">
        <img
          src={project.img}
          alt=""
          loading="lazy"
          className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </span>
      <span className="block p-5">
        <span className="headline block">{project.title.trim()}</span>
        <span className="caption mt-1 line-clamp-2 text-secondary">
          {project.techStack}
        </span>
      </span>
    </button>
  );
}

function Projects() {
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(false);
  const cardRefs = useRef({});

  const active = FrontEndProjects.find((p) => p.id === activeId) ?? null;

  const openProject = (id) => {
    setActiveId(id);
    setOpen(true);
  };
  const requestOpen = useCallback(() => setOpen(true), []);
  const requestClose = useCallback(() => setOpen(false), []);
  const handleClosed = useCallback(() => setActiveId(null), []);

  return (
    <section id="projects" className="container-page py-24 sm:py-32">
      <SectionHeader eyebrow="Projects" title="Selected work.">
        Full-stack projects built with React and the MERN stack, spanning
        e-commerce, social platforms, and developer tooling.
      </SectionHeader>

      <ul className="grid gap-6 sm:grid-cols-2">
        {FrontEndProjects.map((project, index) => (
          <Reveal as="li" key={project.id} delay={(index % 2) * 80}>
            <ProjectCard
              project={project}
              hidden={project.id === activeId}
              onOpen={() => openProject(project.id)}
              cardRef={(el) => {
                cardRefs.current[project.id] = el;
              }}
            />
          </Reveal>
        ))}
      </ul>

      <div className="mt-20">
        <Reveal as="h3" className="title-2">
          APIs
        </Reveal>
        <Reveal as="p" delay={60} className="mt-2 max-w-[60ch] text-secondary">
          REST services built with Node.js, Express, and MongoDB, documented in
          Postman.
        </Reveal>
        <Reveal
          as="ul"
          delay={120}
          className="mt-6 divide-y divide-separator overflow-hidden rounded-[20px] bg-surface shadow-card"
        >
          {BackendApi.map((api) => (
            <li key={api.id}>
              <a
                href={api.liveLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-label/[0.03] active:bg-label/[0.07]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{api.title}</span>
                  <span className="caption mt-0.5 line-clamp-1 text-secondary">
                    {api.techStack}
                  </span>
                </span>
                <span className="caption flex shrink-0 items-center gap-0.5 font-medium text-accent">
                  Docs
                  <FiArrowUpRight aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>

      <ProjectSheet
        project={active}
        originEl={active ? cardRefs.current[active.id] : null}
        open={open}
        onRequestOpen={requestOpen}
        onRequestClose={requestClose}
        onClosed={handleClosed}
      />
    </section>
  );
}

export default Projects;
