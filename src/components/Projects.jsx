import ProjectCard from "./ProjectCard";
import { FrontEndProjects } from "./ProjectItem";

function Projects() {
  return (
    <div id="projects" className="max-w-[1040px] m-auto md:pl-20 p-4 py-16 ">
      <h1 className="text-4xl font-bold text-center text-[#001b5e]">
        Projects
      </h1>
      <div className="w-28 m-auto h-1 rounded-lg bg-[#facc15]"></div>
      <p className=" py-8 text-left text-lg ">
        During my mastery of React.js, I undertook diverse projects showcasing
        proficiency in frontend development. Notable examples include an
        e-commerce platform with dynamic product displays, a social media
        platform leveraging React hooks, and a responsive personal portfolio
        site. These projects reflect my commitment to creating interactive,
        efficient, and visually compelling user interfaces.
      </p>
      <div className="grid sm:grid-cols-2 gap-12">
        {FrontEndProjects?.map((item) => {
          return <ProjectCard key={item.id} item={item} frontend />;
        })}
      </div>
    </div>
  );
}

export default Projects;
