import ProjectCard from "./ProjectCard";
import { ProjectItem } from "./ProjectItem";

function Projects() {
  return (
    <div id="projects" className="max-w-[1040px] m-auto md:pl-20 p-4 py-16 ">
      <h1 className="text-4xl font-bold text-center text-[#001b5e]">
        Projects
      </h1>
      <p className="text-center py-8">
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters
      </p>
      <div className="grid sm:grid-cols-2 gap-12">
        {ProjectItem?.map((item) => {
          return <ProjectCard key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
}

export default Projects;
