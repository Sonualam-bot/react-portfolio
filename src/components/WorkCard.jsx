function WorkCard({ item }) {
  const { year, title, duration, details } = item;
  return (
    <ol className="flex flex-col md:flex-row relative border-l-2 text-lg border-[#001b5e] ">
      <li className="mb-10 ml-4">
        <div
          className="absolute w-3 h-3
         bg-[#001b5e] rounded-full
          mt-1.5 -left-1.5 border-white"
        />
        <p className="flex flex-wrap gap-4 flex-row items-center justify-start text-xs md:text-sm">
          <span className="inline-block px-2 py-1 font-semibold text-white bg-[#001b5e] rounded-md">
            {year}
          </span>
          <span className="text-lg font-semibold text-[#001b5e]">{title}</span>
          <span className="my-1 text-sm font-normal leading-none text-stone-400">
            {duration}
          </span>
        </p>
        <p>
          <span className="my-2  font-normal  text-stone-500">{details}</span>
        </p>
      </li>
    </ol>
  );
}

export default WorkCard;
