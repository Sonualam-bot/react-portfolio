function WorkCard({ item }) {
  const { year, title, company, duration, details } = item;
  return (
    <ol className="relative border-l-2 border-zinc-800 pl-6 pb-2">
      <li className="mb-10">
        <div className="absolute w-3 h-3 bg-lime-400 rounded-full mt-1.5 -left-[7px] ring-4 ring-black shadow-[0_0_8px_rgba(163,230,53,0.7)]" />
        <p className="flex flex-wrap gap-3 items-center text-xs md:text-sm">
          <span className="inline-block px-2 py-1 font-display font-bold text-black bg-lime-400 rounded-md">
            {year}
          </span>
          <span className="text-lg font-display font-semibold text-white">
            {title}
          </span>
          <span className="text-sm font-normal leading-none text-zinc-500">
            {duration}
          </span>
        </p>
        {company && (
          <p className="mt-1 text-sm font-medium text-lime-400">{company}</p>
        )}
        <p className="mt-2 font-normal text-zinc-400">{details}</p>
      </li>
    </ol>
  );
}

export default WorkCard;
