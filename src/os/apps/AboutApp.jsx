import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import PortraitImg from "../../assets/Renon.jpeg";
import { RESUME_URL, socialLinks } from "../../data/profile";
import { useOS } from "../OSContext";

const socialIcons = { GitHub: FiGithub, LinkedIn: FiLinkedin, X: FaXTwitter };

const specs = [
  ["Role", "Software Engineer"],
  ["Company", "RekiSe Marine Pvt Ltd"],
  ["Location", "Bengaluru, India"],
  ["Focus", "React, TypeScript, OpenLayers"],
];

// Laid out like a classic "System Properties" dialog.
function AboutApp({ close }) {
  const { open } = useOS();

  return (
    <div className="app-dialog">
      <div className="xp-tabs">
        <span className="xp-tab is-active">General</span>
      </div>
      <div className="xp-tabpanel">
        <div className="about-top">
          <img
            src={PortraitImg}
            alt="Portrait of Md Sonu Alam"
            width="535"
            height="798"
            className="about-photo"
          />
          <div>
            <p className="about-label">System:</p>
            <h3 className="about-name">Md Sonu Alam</h3>
            <dl className="about-specs">
              {specs.map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}:</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <fieldset className="xp-groupbox">
          <legend>About me</legend>
          <p>
            I&apos;m a software engineer with close to two years of experience
            building React and TypeScript applications in a startup. At RekiSe
            Marine I work on GIS-based marine monitoring and mission planning:
            interactive maps, real-time telemetry dashboards, and the reusable
            component library the rest of the product is built on.
          </p>
          <p>
            I care about component architecture, clean API integration, and
            frontend performance, the details that keep an application reliable
            as it grows.
          </p>
        </fieldset>

        <fieldset className="xp-groupbox">
          <legend>Find me online</legend>
          <ul className="about-links">
            {socialLinks.map(({ label, href }) => {
              const Icon = socialIcons[label];
              return (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className="xp-link">
                    <Icon aria-hidden /> {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>

      <div className="dialog-buttons">
        <button type="button" className="xp-btn" onClick={() => open("projects")}>
          View Projects
        </button>
        <a href={RESUME_URL} target="_blank" rel="noreferrer" className="xp-btn">
          Résumé...
        </a>
        <button type="button" className="xp-btn" onClick={close}>
          OK
        </button>
      </div>
    </div>
  );
}

export default AboutApp;
