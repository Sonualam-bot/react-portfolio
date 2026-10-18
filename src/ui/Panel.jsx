import { useEffect, useRef } from "react";
import { FiArrowRight, FiFileText, FiX } from "react-icons/fi";
import { RESUME_URL } from "../data/profile";
import { commands } from "../game/bridge";
import { poiById, buoys } from "../game/world";
import { About, Links, Project, Timeline } from "./content";
import { nextStopFor } from "./Onboarding";
import ContactForm from "./ContactForm";
import { useGame } from "./useGame";

const courseLabel = (from, to) => {
  if (to.kind === "lighthouse") return `Ride the current to ${to.job.year}`;
  if (to.kind === "project" && from.kind !== "project") return `Head for the Project Archipelago: ${to.name}`;
  if (to.kind === "api" && from.kind !== "api") return `On to the API atolls: ${to.name}`;
  if (to.kind === "signal") return "Signal me about the next chapter";
  return undefined;
};

// Always points somewhere new: the next unvisited island, then the chest
// once it's been spotted, then (with every island done) the radio station.
const nextCourse = (from, visited, charted) => {
  const to = nextStopFor(visited, from);
  if (to) return <SetCourse poi={to} label={courseLabel(from, to)} />;
  if (charted.includes("treasure") && !visited.includes("treasure"))
    return <SetCourse poi={poiById.treasure} label="Dive for the sunken chest" />;
  if (from.kind !== "signal")
    return <SetCourse poi={poiById.signal} label="Every island explored. Radio the captain" />;
  return null;
};

function SetCourse({ poi, label }) {
  if (!poi) return null;
  return (
    <button
      type="button"
      className="btn btn-ghost-ink"
      onClick={() => {
        commands.closePanel();
        commands.setCourse(poi.id);
      }}
    >
      {label ?? `Set course: ${poi.name}`} <FiArrowRight aria-hidden />
    </button>
  );
}

function usePanelContent(panel) {
  const { visited, skills, charted } = useGame();
  const poi = poiById[panel.id];

  switch (panel.kind) {
    case "port":
      return {
        eyebrow: "Home port · Captain's quarters",
        title: "Md Sonu Alam",
        body: <About />,
        footer: nextCourse(poi, visited, charted),
      };
    case "project":
    case "api":
      return {
        eyebrow: poi.kind === "api" ? "API atoll · Backend" : "Project island",
        title: poi.name,
        body: <Project project={poi.project} />,
        footer: nextCourse(poi, visited, charted),
      };
    case "lighthouse":
      return {
        eyebrow: `Lighthouse · ${poi.job.year}`,
        title: poi.job.title,
        body: <Timeline activeId={poi.id} />,
        footer: nextCourse(poi, visited, charted),
      };
    case "signal":
      return {
        eyebrow: "Signal station · Contact",
        title: "Send a transmission",
        body: (
          <>
            <p className="panel-lede">
              Hiring, collaborating, or just saying hello? Radio it in and it lands in
              my inbox.
            </p>
            <ContactForm />
          </>
        ),
        footer: <Links />,
      };
    case "treasure":
      return {
        eyebrow: "Wreck shoals · Sunken chest",
        title: "The captain's papers",
        body: (
          <div className="treasure">
            <p className="panel-lede">
              You dove for it and found it: the full record of service. Everything on
              this chart, plus the details, on one page.
            </p>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn btn-ink btn-big">
              <FiFileText aria-hidden /> Open the résumé
            </a>
          </div>
        ),
      };
    case "complete":
      return {
        eyebrow: "Survey complete",
        title: "Chart filed. Fine sailing, captain.",
        body: (
          <div className="treasure">
            <p className="panel-lede">
              You charted all {charted.length} places and brought {skills.length} of{" "}
              {buoys.length} skills aboard. If you made it this far, we should probably
              talk.
            </p>
            <Links />
          </div>
        ),
        footer: !visited.includes("signal") && <SetCourse poi={poiById.signal} label="Sail to the signal station" />,
      };
    default:
      return { title: "", body: null };
  }
}

function Panel({ panel }) {
  const { eyebrow, title, body, footer } = usePanelContent(panel);
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && commands.closePanel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel.id]);

  return (
    <div className="scrim" onPointerDown={(e) => e.target === e.currentTarget && commands.closePanel()}>
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="panel-title" key={panel.id}>
        <header className="sheet-head">
          <div>
            {eyebrow && <p className="eyebrow eyebrow-ink">{eyebrow}</p>}
            <h2 id="panel-title">{title}</h2>
          </div>
          <button ref={closeRef} type="button" className="sheet-close" aria-label="Cast off (close)" onClick={() => commands.closePanel()}>
            <FiX aria-hidden />
          </button>
        </header>
        <div className="sheet-body">{body}</div>
        {footer && <footer className="sheet-foot">{footer}</footer>}
      </section>
    </div>
  );
}

export default Panel;
