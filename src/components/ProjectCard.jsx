function ProjectCard({ item, frontend }) {
  const { id, img, title, liveLink, github, techStack } = item;
  return (
    <div
      key={id}
      className="group relative max-w-2xl rounded-lg border border-gray-100 p-3 shadow-2xl shadow-gray-[#001b5e]/10 md:p-4"
    >
      <div className="relative w-full overflow-hidden rounded-lg shadow-lg ">
        <img
          src={img}
          alt="cover"
          loading="lazy"
          width="900"
          height="590"
          className="h-52 w-full object-cover object-top overflow-hidden  transition duration-500 group-hover:scale-110 group-hover:shadow-md "
        />
      </div>

      <div className="hidden group-hover:block absolute top-[35%] left-[50%] translate-x-[-50%] translate-y-[-50%]  ">
        {/* <h3 className="text-2xl font-bold text-white tracking-wider text-center">
          {title}
        </h3> */}
        {/* <div className="flex flex-row items-center gap-3 justify-center ">
          {techStack?.map((stack, index) => {
            return (
              <p key={index} className="pb-4 pt-2 text-white text-center">
                {stack}
              </p>
            );
          })}
        </div> */}

        <div className="flex items-center justify-center gap-6 ">
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

      <div className="relative mt-3">
        <h3 className="text-2xl font-semibold uppercase text-[#001b5e] ">
          {" "}
          {title}{" "}
        </h3>
        <p className="mt-3 ">{techStack}</p>
      </div>
    </div>
  );
}

export default ProjectCard;
