import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { socialLinks } from "./profile";

const icons = { GitHub: FiGithub, LinkedIn: FiLinkedin, X: FaXTwitter };

function SocialLinks({ className = "" }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {socialLinks.map(({ label, href }) => {
        const Icon = icons[label];
        return (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="pressable flex h-11 w-11 items-center justify-center rounded-full text-secondary hover:bg-label/[0.06] hover:text-label"
            >
              <Icon size={19} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;
