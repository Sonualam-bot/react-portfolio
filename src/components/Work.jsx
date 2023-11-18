import WorkCard from "./WorkCard";
import { workDetails } from "./WorkItem";

function Work() {
  return (
    <div id="journey" className="max-w-[1040px] m-auto md:pl-20 p-4 py-16">
      <h1 className="text-4xl font-bold text-center text-[#001b5e] ">
        My Learning Journey
      </h1>
      <div className="w-[340px] m-auto h-1 rounded-lg bg-[#facc15] mb-4 "></div>
      {workDetails?.map((item, index) => {
        return <WorkCard key={index} item={item} />;
      })}
    </div>
  );
}

export default Work;
