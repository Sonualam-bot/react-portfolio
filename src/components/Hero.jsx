import { FiArrowUpRight } from "react-icons/fi";
import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";
import { RESUME_URL } from "./profile";

function Hero() {
  return (
    <section id="top" className="container-page pb-20 pt-36 sm:pb-28 sm:pt-48">
      <Reveal as="p" className="eyebrow">
        Software Engineer at RekiSe Marine
      </Reveal>
      <Reveal as="h1" delay={60} className="display mt-3">
        Md Sonu Alam
      </Reveal>
      <Reveal as="p" delay={120} className="lead mt-6 max-w-[32ch] text-secondary">
        I build map-driven, real-time interfaces with React and TypeScript, and
        care about the details that make them feel dependable.
      </Reveal>
      <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-3">
        <a href="#projects" className="btn btn-primary">
          See projects
        </a>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
        >
          Résumé
          <FiArrowUpRight aria-hidden />
        </a>
        <SocialLinks />
      </Reveal>
    </section>
  );
}

export default Hero;
