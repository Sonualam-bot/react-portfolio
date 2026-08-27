import WorkCard from "./WorkCard";
import { workDetails } from "./WorkItem";
import Reveal from "./Reveal";

function Work() {
  return (
    <div id="journey" className="max-w-[1040px] m-auto md:pl-20 px-4 py-16 sm:py-20">
      <Reveal as="h1" className="text-3xl sm:text-4xl font-display font-bold text-center text-white">
        Experience &amp; Education
      </Reveal>
      <div className="w-64 sm:w-[340px] m-auto h-1 rounded-lg bg-lime-400 mt-2 mb-8"></div>
      {workDetails?.map((item, index) => (
        <Reveal key={index} delay={index * 80}>
          <WorkCard item={item} />
        </Reveal>
      ))}
    </div>
  );
}

export default Work;
