import { useEffect, useRef } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import PortraitImg from "../assets/Renon.jpeg";
import { RESUME_URL, socialLinks } from "../data/profile";
import { useOS } from "./OSContext";
import { LogOffIcon, PowerIcon, iconFor } from "./icons";

const pinned = [
  { app: "projects", label: "My Projects", hint: "Things I've built" },
  { app: "about", label: "My Profile", hint: "Who I am" },
  { app: "experience", label: "Experience", hint: "experience.txt" },
  { app: "skills", label: "Skills", hint: "Installed programs" },
  { app: "contact", label: "Contact Me", hint: "Send a message" },
];

const socialIcons = { GitHub: FiGithub, LinkedIn: FiLinkedin, X: FaXTwitter };

function StartMenu({ onClose, onLogOff, onTurnOff, startButtonRef }) {
  const { open } = useOS();
  const menuRef = useRef(null);

  useEffect(() => {
    menuRef.current?.querySelector("button, a")?.focus();
    const onPointerDown = (e) => {
      if (!menuRef.current?.contains(e.target) && !startButtonRef.current?.contains(e.target)) onClose();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        startButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, startButtonRef]);

  const AppIcon = (name, size) => {
    const Icon = iconFor[name];
    return <Icon size={size} />;
  };

  return (
    <div id="start-menu" ref={menuRef} className="start-menu" role="menu" aria-label="Start menu">
      <header className="start-header">
        <img src={PortraitImg} alt="" className="start-avatar" />
        <span>Md Sonu Alam</span>
      </header>

      <div className="start-body">
        <ul className="start-left">
          {pinned.map(({ app, label, hint }) => (
            <li key={app}>
              <button type="button" role="menuitem" className="start-item" onClick={() => open(app)}>
                {AppIcon(
                  { projects: "folder", about: "profile", experience: "notepad", skills: "disc", contact: "mail" }[app],
                  32
                )}
                <span>
                  <strong>{label}</strong>
                  <small>{hint}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <ul className="start-right">
          <li>
            <a role="menuitem" className="start-item is-compact" href={RESUME_URL} target="_blank" rel="noreferrer" onClick={onClose}>
              {AppIcon("resume", 24)}
              <strong>My Résumé</strong>
            </a>
          </li>
          <li>
            <button type="button" role="menuitem" className="start-item is-compact" onClick={() => open("recycle")}>
              {AppIcon("recycle", 24)}
              <strong>Recycle Bin</strong>
            </button>
          </li>
          <li className="start-separator" role="separator" />
          {socialLinks.map(({ label, href }) => {
            const Icon = socialIcons[label];
            return (
              <li key={label}>
                <a role="menuitem" className="start-item is-compact" href={href} target="_blank" rel="noreferrer" onClick={onClose}>
                  <span className="start-social">
                    <Icon aria-hidden />
                  </span>
                  <span>{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="start-footer">
        <button type="button" role="menuitem" className="start-footer-button" onClick={onLogOff}>
          <LogOffIcon size={22} />
          Log Off
        </button>
        <button type="button" role="menuitem" className="start-footer-button" onClick={onTurnOff}>
          <PowerIcon size={22} />
          Turn Off Computer
        </button>
      </footer>
    </div>
  );
}

export default StartMenu;
