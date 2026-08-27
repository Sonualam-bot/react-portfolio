import RenonImg from "../assets/Renon.jpeg";

function About() {
  return (
    <div
      id="about"
      className="max-w-[1040px] mx-auto md:pl-20 px-4 py-16 sm:py-20"
    >
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-center text-white mb-1">
        About
      </h1>
      <div className="w-20 m-auto h-1 rounded-lg bg-lime-400 mb-8 sm:mb-10"></div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div className="rounded-xl w-48 md:w-[280px] mx-auto md:mx-0 overflow-hidden ring-2 ring-lime-400/60 shadow-[0_0_24px_rgba(163,230,53,0.2)]">
          <img src={RenonImg} alt="/dev" className="w-full h-full rounded-xl" />
        </div>
        <div className="flex flex-col text-center md:text-left">
          <p className="text-base sm:text-lg text-zinc-400 mb-4">
            I&apos;m Md Sonu Alam, a Software Engineer with close to two years
            of experience building React.js and TypeScript applications in a
            startup environment. At RekiSe Marine, I build GIS-based marine
            monitoring and mission planning systems interactive maps, real-time
            telemetry dashboards, and reusable component libraries used across
            the product.
          </p>
          <p className="text-base sm:text-lg text-zinc-400 mb-6">
            I care about reusable component architecture, clean API integration,
            and frontend performance the kind of details that keep an
            application reliable as it grows. I enjoy working closely with
            product and backend teams to turn real operational problems into
            interfaces people can trust.
          </p>
          <a
            href="https://drive.google.com/file/d/1iLsgFDPtjev--mjt_GlqZnMS9fS1T5rn/view?usp=sharing"
            className="text-center w-[190px] mx-auto md:mx-0 px-2 py-3 cursor-pointer text-black font-display font-bold uppercase tracking-wide text-sm rounded-md bg-lime-400 hover:bg-lime-300 transition-colors duration-300 shadow-[0_0_16px_rgba(163,230,53,0.3)]"
            target="_blank"
            rel="noreferrer"
          >
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
