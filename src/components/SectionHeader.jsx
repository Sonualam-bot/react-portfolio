import Reveal from "./Reveal";

function SectionHeader({ eyebrow, title, children }) {
  return (
    <header className="mb-12 sm:mb-16">
      <Reveal as="p" className="eyebrow">
        {eyebrow}
      </Reveal>
      <Reveal as="h2" delay={60} className="title-1 mt-2 max-w-[18ch]">
        {title}
      </Reveal>
      {children && (
        <Reveal as="p" delay={120} className="mt-5 max-w-[60ch] text-secondary">
          {children}
        </Reveal>
      )}
    </header>
  );
}

export default SectionHeader;
