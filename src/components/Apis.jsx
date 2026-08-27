import ProjectCard from "./ProjectCard";
import { BackendApi } from "./ProjectItem";

function Apis() {
  return (
    <div id="projects" className="max-w-[1040px] m-auto md:pl-20 px-4 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-center text-stone-900">
        Api&#39;s
      </h1>
      <div className="w-28 m-auto h-1 rounded-lg bg-teal-600 mt-2"></div>
      <p className="py-8 text-left text-base sm:text-lg text-stone-600">
        In the realm of backend API development, I&#39;ve excelled in crafting
        robust solutions with MongoDB, Express.js, and Node.js. Have Created
        successfull Api&#39;s for efficient data handling, and RESTful API for
        dynamic content delivery. These ventures showcase my expertise in
        creating efficient and scalable backend solutions.
      </p>
      <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
        {BackendApi?.map((item) => {
          return <ProjectCard key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
}

export default Apis;
