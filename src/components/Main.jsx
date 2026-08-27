import { TypeAnimation } from "react-type-animation";
import GraphemeSplitter from "grapheme-splitter";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const splitter = new GraphemeSplitter();

function Main() {
  return (
    <div
      id="main"
      className="relative h-screen w-full bg-black overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#a3e635 1px, transparent 1px), linear-gradient(90deg, #a3e635 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="h-full w-full flex flex-col justify-center items-center px-6 text-center relative">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          className="mb-6 drop-shadow-[0_0_16px_rgba(163,230,53,0.55)]"
        >
          <circle
            cx="36"
            cy="36"
            r="32"
            fill="none"
            stroke="#a3e635"
            strokeWidth="3"
            strokeDasharray="6 10"
          />
          <circle cx="36" cy="36" r="22" fill="#0a0a0a" stroke="#a3e635" strokeWidth="2" />
          <circle cx="36" cy="36" r="8" fill="#a3e635" />
        </svg>

        <p className="text-xs sm:text-sm font-display font-bold tracking-[0.3em] uppercase text-lime-400 mb-4">
          Frontend Engineer
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3">
          <TypeAnimation
            splitter={(str) => splitter.splitGraphemes(str)}
            sequence={[
              "Hello",
              2000,
              "Ciao",
              2000,
              "你好",
              2000,
              "Здравейте",
              2000,
              "Hola",
              2000,
              "Bonjour",
              2000,
              "नमस्ते",
              2000,
            ]}
            wrapper="span"
            cursor={true}
            speed={50}
            style={{ fontSize: "1em", paddingLeft: "5px" }}
            repeat={Infinity}
          />
        </h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">
          I&apos;m Md Sonu Alam
        </h1>
        <h2 className="flex text-lg sm:text-xl md:text-2xl pt-4 text-zinc-400 font-medium">
          I build with
          <TypeAnimation
            sequence={[
              "React.js",
              2000,
              "TypeScript",
              2000,
              "Next.js",
              2000,
            ]}
            wrapper="span"
            cursor={true}
            speed={50}
            style={{ fontSize: "1em", paddingLeft: "5px", color: "#a3e635" }}
            repeat={Infinity}
          />
        </h2>
        <a
          href="#projects"
          className="mt-8 px-7 py-3 rounded-md bg-lime-400 text-black text-sm font-display font-bold uppercase tracking-wider hover:bg-lime-300 transition-colors shadow-[0_0_20px_rgba(163,230,53,0.35)]"
        >
          View My Work
        </a>
        <div className="flex justify-between pt-10 max-w-[200px] w-full">
          <NavLink
            to="https://x.com/md_sonu_alam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-lime-400 transition-colors"
          >
            <FaTwitter className="cursor-pointer" size={20} />
          </NavLink>

          <NavLink
            to="https://github.com/Sonualam-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-lime-400 transition-colors"
          >
            <FaGithub className="cursor-pointer" size={20} />
          </NavLink>

          <NavLink
            to="https://www.linkedin.com/in/mdsonualam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-lime-400 transition-colors"
          >
            <FaLinkedin className="cursor-pointer" size={20} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Main;
