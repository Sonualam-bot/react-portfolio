function ProjectCard({ item, frontend }) {
  const { id, img, title, liveLink, github, techStack } = item;
  return (
    <div
      key={id}
      className="group relative max-w-2xl rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition-colors duration-300 hover:border-teal-600/50 hover:shadow-md md:p-4"
    >
      <div className="relative w-full overflow-hidden rounded-lg">
        <img
          src={img}
          alt="cover"
          loading="lazy"
          width="900"
          height="590"
          className="h-52 w-full object-cover object-top overflow-hidden transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="relative mt-4">
        <h3 className="text-xl sm:text-2xl font-display font-semibold uppercase text-stone-900">
          {title}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-stone-600">{techStack}</p>

        <div className="flex items-center gap-3 mt-4">
          <a
            href={liveLink}
            className="text-center px-4 py-2 rounded-lg bg-stone-900 text-white font-semibold cursor-pointer text-sm hover:bg-teal-600 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
          {frontend && (
            <a
              href={github}
              className="text-center px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold cursor-pointer text-sm hover:border-amber-500 hover:text-amber-600 transition-colors"
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
