function ProjectCard({ item, frontend }) {
  const { id, img, title, liveLink, github, techStack } = item;
  return (
    <div
      key={id}
      className="relative flex items-center justify-center h-auto w-full shadow-xl shadow-gray-400 rounded-xl group hover:bg-gradient-to-r from-gray-200 to-[#001b5e] "
    >
      <img
        src={img}
        alt="/img"
        className="rounded-xl 
        transition ease-in-out duration-1000 group-hover:opacity-10 w-full h-full  "
      />

      <div className="hidden group-hover:block absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  ">
        <h3 className="text-2xl font-bold text-white tracking-wider text-center">
          {title}
        </h3>
        <div className="flex flex-row items-center gap-3 justify-center ">
          {techStack?.map((stack, index) => {
            return (
              <p key={index} className="pb-4 pt-2 text-white text-center">
                {stack}
              </p>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 ">
          <a
            href={liveLink}
            className="text-center p-2 rounded-lg bg-white text-gray-700 font-bold cursor-pointer text-lg"
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
          {frontend && (
            <a
              href={github}
              className="text-center p-2 rounded-lg bg-white text-gray-700 font-bold cursor-pointer text-lg"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
