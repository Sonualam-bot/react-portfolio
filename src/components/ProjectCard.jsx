function ProjectCard({ item, frontend }) {
  const { id, img, title, liveLink, github, techStack } = item;
  return (
    <div
      key={id}
      className="group relative max-w-2xl rounded-lg border border-zinc-800 bg-zinc-950 p-3 transition-colors duration-300 hover:border-lime-400/60 hover:shadow-[0_0_18px_rgba(163,230,53,0.15)] md:p-4"
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
        <h3 className="text-xl sm:text-2xl font-display font-semibold uppercase text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">{techStack}</p>

        <div className="flex items-center gap-3 mt-4">
          <a
            href={liveLink}
            className="text-center px-4 py-2 rounded-md bg-lime-400 text-black font-display font-bold uppercase tracking-wide cursor-pointer text-xs hover:bg-lime-300 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
          {frontend && (
            <a
              href={github}
              className="text-center px-4 py-2 rounded-md border border-zinc-700 text-zinc-300 font-display font-bold uppercase tracking-wide cursor-pointer text-xs hover:border-lime-400 hover:text-lime-400 transition-colors"
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
