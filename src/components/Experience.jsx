import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { workDetails } from "./WorkItem";

function Experience() {
  return (
    <section id="experience" className="container-page py-24 sm:py-32">
      <SectionHeader eyebrow="Experience" title="Where I've been." />

      <ol className="border-t border-separator">
        {workDetails.map((item, index) => (
          <Reveal
            as="li"
            key={item.title}
            delay={index * 60}
            className="grid gap-1 border-b border-separator py-8 sm:grid-cols-[11rem_1fr] sm:gap-8"
          >
            <div className="caption text-secondary">
              <p className="font-medium text-label">{item.year}</p>
              <p className="mt-0.5">{item.duration}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <h3 className="headline">{item.title}</h3>
              {item.company && <p className="mt-0.5 text-secondary">{item.company}</p>}
              <p className="mt-3 max-w-[62ch] text-secondary">{item.details}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export default Experience;
