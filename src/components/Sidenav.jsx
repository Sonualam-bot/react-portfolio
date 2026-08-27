//react- icons
import { useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineProject,
} from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { GiJourney } from "react-icons/gi";

const navLinks = [
  { href: "#main", label: "Home", Icon: AiOutlineHome },
  { href: "#about", label: "About", Icon: BsPerson },
  { href: "#skills", label: "Skills", Icon: IoSettingsOutline },
  { href: "#projects", label: "Projects", Icon: AiOutlineProject },
  { href: "#journey", label: "Journey", Icon: GiJourney },
  { href: "#contact", label: "Contact", Icon: AiOutlineMail },
];

function Sidenav() {
  const [nav, setNav] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    document.body.style.overflow = nav ? "hidden" : "";

    if (!nav) {
      setMenuVisible(false);
      return () => {
        document.body.style.overflow = "";
      };
    }

    const frame = requestAnimationFrame(() => setMenuVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [nav]);

  return (
    <div>
      {nav ? (
        <AiOutlineClose
          onClick={handleNav}
          size={24}
          className="fixed top-4 right-4 z-[99] md:hidden cursor-pointer text-lime-400"
        />
      ) : (
        <AiOutlineMenu
          onClick={handleNav}
          size={24}
          className="fixed top-4 right-4 z-[99] md:hidden cursor-pointer text-lime-400"
        />
      )}
      {nav ? (
        <div
          className={`fixed inset-0 w-full h-[100dvh] bg-black/70 backdrop-blur-md flex flex-col justify-center items-center z-20 text-white gap-3 overscroll-contain transition-opacity duration-300 ${
            menuVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {navLinks.map(({ href, label, Icon }, index) => (
            <a
              key={href}
              onClick={handleNav}
              href={href}
              className={`w-[75%] max-w-xs flex items-center gap-4 rounded-md border border-lime-500/30 bg-zinc-950/80 px-5 py-4 cursor-pointer hover:border-lime-400 hover:text-lime-400 transition-all duration-300 ${
                menuVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: `${menuVisible ? index * 60 : 0}ms` }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      ) : (
        ""
      )}
      <div className="md:flex hidden flex-col fixed top-1/2 -translate-y-1/2 left-4 z-10 gap-2 rounded-full border border-lime-500/30 bg-zinc-950/90 backdrop-blur-sm p-2 shadow-[0_0_20px_rgba(163,230,53,0.15)]">
        {navLinks.map(({ href, Icon }) => (
          <a
            key={href}
            href={href}
            className="rounded-full p-3 text-zinc-500 cursor-pointer hover:text-lime-400 hover:bg-zinc-900 transition-colors duration-200"
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
}

export default Sidenav;
