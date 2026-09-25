import PortraitImg from "../assets/Renon.jpeg";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const facts = [
  { term: "Currently", detail: "Software Engineer, RekiSe Marine" },
  { term: "Based in", detail: "Bengaluru, India" },
  { term: "Focus", detail: "React, TypeScript, OpenLayers" },
];

function About() {
  return (
    <section id="about" className="container-page py-24 sm:py-32">
      <SectionHeader eyebrow="About" title="Interfaces people can trust." />

      <div className="grid items-start gap-10 md:grid-cols-[17.5rem_1fr] md:gap-16">
        <Reveal className="mx-auto w-full max-w-[17.5rem] overflow-hidden rounded-[1.75rem] bg-surface shadow-card">
          <img
            src={PortraitImg}
            alt="Portrait of Md Sonu Alam"
            width="535"
            height="798"
            className="aspect-[4/5] w-full object-cover"
          />
        </Reveal>

        <Reveal delay={80}>
          <p className="text-label">
            I&apos;m a software engineer with close to two years of experience
            building React and TypeScript applications in a startup. At RekiSe
            Marine I work on GIS-based marine monitoring and mission planning:
            interactive maps, real-time telemetry dashboards, and the reusable
            component library the rest of the product is built on.
          </p>
          <p className="mt-5 text-secondary">
            I care about component architecture, clean API integration, and
            frontend performance, the details that keep an application
            reliable as it grows. I like working closely with product and
            backend teams to turn real operational problems into calm, clear
            interfaces.
          </p>

          <dl className="mt-10 grid gap-6 border-t border-separator pt-6 sm:grid-cols-3">
            {facts.map(({ term, detail }) => (
              <div key={term}>
                <dt className="caption text-secondary">{term}</dt>
                <dd className="mt-1 font-medium">{detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export default About;
