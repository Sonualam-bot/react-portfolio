import { TypeAnimation } from "react-type-animation";
import GraphemeSplitter from "grapheme-splitter";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const splitter = new GraphemeSplitter();

function Main() {
  return (
    <div id="main" className="relative h-screen w-full bg-white">
      <div className="h-full w-full flex flex-col justify-center items-center px-6 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-teal-600 mb-4">
          Frontend Engineer
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-stone-900 mb-3">
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-stone-900">
          I&apos;m Md Sonu Alam
        </h1>
        <h2 className="flex text-lg sm:text-xl md:text-2xl pt-4 text-stone-500 font-medium">
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
            style={{ fontSize: "1em", paddingLeft: "5px", color: "#0d9488" }}
            repeat={Infinity}
          />
        </h2>
        <a
          href="#projects"
          className="mt-8 px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-semibold hover:bg-teal-600 transition-colors"
        >
          View My Work
        </a>
        <div className="flex justify-between pt-10 max-w-[200px] w-full">
          <NavLink
            to="https://x.com/md_sonu_alam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-teal-600 transition-colors"
          >
            <FaTwitter className="cursor-pointer" size={20} />
          </NavLink>

          <NavLink
            to="https://github.com/Sonualam-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-teal-600 transition-colors"
          >
            <FaGithub className="cursor-pointer" size={20} />
          </NavLink>

          <NavLink
            to="https://www.linkedin.com/in/mdsonualam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-teal-600 transition-colors"
          >
            <FaLinkedin className="cursor-pointer" size={20} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Main;
