import ProjectCard from "./ProjectCard";
import { ProjectItem } from "./ProjectItem";

function Projects() {
  return (
    <div id="projects" className="max-w-[1040px] m-auto md:pl-20 px-4 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-center text-white">
        Projects
      </h1>
      <div className="w-28 m-auto h-1 rounded-lg bg-lime-400 mt-2"></div>
      <p className="py-8 text-left text-base sm:text-lg text-zinc-400">
        A selection of full-stack projects built with React and the MERN
        stack, spanning e-commerce, social platforms, and developer
        tooling. Each one reflects the same habits I bring to production
        work: reusable components, clean API integration, and interfaces
        people can rely on.
      </p>
      <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
        {ProjectItem?.map((item) => {
          return <ProjectCard key={item.id} item={item} frontend />;
        })}
      </div>
    </div>
  );
}

export default Projects;
