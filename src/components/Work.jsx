import WorkCard from "./WorkCard";
import { workDetails } from "./WorkItem";

function Work() {
  return (
    <div id="journey" className="max-w-[1040px] m-auto md:pl-20 px-4 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-center text-stone-900">
        Experience &amp; Education
      </h1>
      <div className="w-64 sm:w-[340px] m-auto h-1 rounded-lg bg-teal-600 mt-2 mb-8"></div>
      {workDetails?.map((item, index) => {
        return <WorkCard key={index} item={item} />;
      })}
    </div>
  );
}

export default Work;
