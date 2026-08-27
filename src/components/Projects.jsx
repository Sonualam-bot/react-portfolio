import ProjectCard from "./ProjectCard";
import { ProjectItem } from "./ProjectItem";
import Reveal from "./Reveal";

function Projects() {
  return (
    <div id="projects" className="max-w-[1040px] m-auto md:pl-20 px-4 py-16 sm:py-20">
      <Reveal as="h1" className="text-3xl sm:text-4xl font-display font-bold text-center text-white">
        Projects
      </Reveal>
      <div className="w-28 m-auto h-1 rounded-lg bg-lime-400 mt-2"></div>
      <Reveal as="p" delay={80} className="py-8 text-left text-base sm:text-lg text-zinc-400">
        A selection of full-stack projects built with React and the MERN
        stack, spanning e-commerce, social platforms, and developer
        tooling. Each one reflects the same habits I bring to production
        work: reusable components, clean API integration, and interfaces
        people can rely on.
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
        {ProjectItem?.map((item, index) => (
          <Reveal key={item.id} delay={(index % 2) * 120}>
            <ProjectCard item={item} frontend />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default Projects;
