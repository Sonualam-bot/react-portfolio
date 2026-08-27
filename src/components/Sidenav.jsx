//react- icons
import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineProject,
} from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { GiJourney } from "react-icons/gi";

function Sidenav() {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div>
      <AiOutlineMenu
        onClick={handleNav}
        size={24}
        className="fixed top-4 right-4 z-[99] md:hidden cursor-pointer text-lime-400"
      />
      {nav ? (
        <div className="fixed inset-0 w-full h-screen bg-black/98 backdrop-blur-sm flex flex-col justify-center items-center z-20 text-white gap-3">
          <a
            onClick={handleNav}
            href="#main"
            className="w-[75%] max-w-xs flex items-center gap-4 rounded-md border border-lime-500/30 bg-zinc-950 px-5 py-4 cursor-pointer hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            <AiOutlineHome size={20} />
            <span>Home</span>
          </a>
          <a
            onClick={handleNav}
            href="#about"
            className="w-[75%] max-w-xs flex items-center gap-4 rounded-md border border-lime-500/30 bg-zinc-950 px-5 py-4 cursor-pointer hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            <BsPerson size={20} />
            <span>About</span>
          </a>
          <a
            onClick={handleNav}
            href="#skills"
            className="w-[75%] max-w-xs flex items-center gap-4 rounded-md border border-lime-500/30 bg-zinc-950 px-5 py-4 cursor-pointer hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            <IoSettingsOutline size={20} />
            <span>Skills</span>
          </a>
          <a
            onClick={handleNav}
            href="#projects"
            className="w-[75%] max-w-xs flex items-center gap-4 rounded-md border border-lime-500/30 bg-zinc-950 px-5 py-4 cursor-pointer hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            <AiOutlineProject size={20} />
            <span>Projects</span>
          </a>

          <a
            onClick={handleNav}
            href="#journey"
            className="w-[75%] max-w-xs flex items-center gap-4 rounded-md border border-lime-500/30 bg-zinc-950 px-5 py-4 cursor-pointer hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            <GiJourney size={20} />
            <span>Journey</span>
          </a>
          <a
            onClick={handleNav}
            href="#contact"
            className="w-[75%] max-w-xs flex items-center gap-4 rounded-md border border-lime-500/30 bg-zinc-950 px-5 py-4 cursor-pointer hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            <AiOutlineMail size={20} />
            <span>Contact</span>
          </a>
        </div>
      ) : (
        ""
      )}
      <div className="md:flex hidden flex-col fixed top-1/2 -translate-y-1/2 left-4 z-10 gap-2 rounded-full border border-lime-500/30 bg-zinc-950/90 backdrop-blur-sm p-2 shadow-[0_0_20px_rgba(163,230,53,0.15)]">
        <a
          href="#main"
          className="rounded-full p-3 text-zinc-500 cursor-pointer hover:text-lime-400 hover:bg-zinc-900 transition-colors duration-200"
        >
          <AiOutlineHome />
        </a>
        <a
          href="#about"
          className="rounded-full p-3 text-zinc-500 cursor-pointer hover:text-lime-400 hover:bg-zinc-900 transition-colors duration-200"
        >
          <BsPerson />
        </a>
        <a
          href="#skills"
          className="rounded-full p-3 text-zinc-500 cursor-pointer hover:text-lime-400 hover:bg-zinc-900 transition-colors duration-200"
        >
          <IoSettingsOutline />
        </a>
        <a
          href="#projects"
          className="rounded-full p-3 text-zinc-500 cursor-pointer hover:text-lime-400 hover:bg-zinc-900 transition-colors duration-200"
        >
          <AiOutlineProject />
        </a>
        <a
          href="#journey"
          className="rounded-full p-3 text-zinc-500 cursor-pointer hover:text-lime-400 hover:bg-zinc-900 transition-colors duration-200"
        >
          <GiJourney />
        </a>

        <a
          href="#contact"
          className="rounded-full p-3 text-zinc-500 cursor-pointer hover:text-lime-400 hover:bg-zinc-900 transition-colors duration-200"
        >
          <AiOutlineMail />
        </a>
      </div>
    </div>
  );
}

export default Sidenav;
