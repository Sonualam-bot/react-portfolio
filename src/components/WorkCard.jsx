function WorkCard({ item }) {
  const { year, title, company, duration, details } = item;
  return (
    <ol className="relative border-l-2 border-stone-200 pl-6 pb-2">
      <li className="mb-10">
        <div className="absolute w-3 h-3 bg-teal-600 rounded-full mt-1.5 -left-[7px] ring-4 ring-white" />
        <p className="flex flex-wrap gap-3 items-center text-xs md:text-sm">
          <span className="inline-block px-2 py-1 font-semibold text-white bg-amber-500 rounded-md">
            {year}
          </span>
          <span className="text-lg font-display font-semibold text-stone-900">
            {title}
          </span>
          <span className="text-sm font-normal leading-none text-stone-400">
            {duration}
          </span>
        </p>
        {company && (
          <p className="mt-1 text-sm font-medium text-teal-700">{company}</p>
        )}
        <p className="mt-2 font-normal text-stone-600">{details}</p>
      </li>
    </ol>
  );
}

export default WorkCard;
