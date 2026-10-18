import { useEffect, useRef, useState } from "react";
import { FiCheck, FiNavigation, FiX } from "react-icons/fi";
import { commands, resetVoyage } from "../game/bridge";
import { pois, buoys } from "../game/world";
import { About, Project, Skills, Timeline } from "./content";
import ContactForm from "./ContactForm";
import { useGame } from "./useGame";
import { startTour } from "./Onboarding";

const TABS = ["Mission", "Captain", "Projects", "APIs", "Career", "Skills", "Contact"];

function Mission({ state, onReplay }) {
  const { charted, visited, skills } = state;
  const count = (kind, list) => pois.filter((p) => p.kind === kind && list.includes(p.id)).length;
  const total = (kind) => pois.filter((p) => p.kind === kind).length;
  const objectives = [
    ["Dock at Port Alam and meet the captain", visited.includes("port") ? 1 : 0, 1],
    ["Explore every island in the Project Archipelago", count("project", visited), total("project")],
    ["Inspect the API atolls to the north", count("api", visited), total("api")],
    ["Ride the Career Current past all four lighthouses", count("lighthouse", visited), total("lighthouse")],
    ["Collect every skill buoy", skills.length, buoys.length],
    ["Radio the signal station", visited.includes("signal") ? 1 : 0, 1],
    ["Rumour has it something glints in the south-west shoals…", charted.includes("treasure") ? 1 : 0, 1],
  ];
  return (
    <div className="mission">
      <p className="panel-lede">
        Survey orders for the RV Sonu. Every island holds a piece of the portfolio; this
        logbook holds all of it, for anyone who&apos;d rather read than sail.
      </p>
      <ul className="objectives">
        {objectives.map(([text, n, of]) => (
          <li key={text} className={n >= of ? "is-done" : undefined}>
            <span className="objective-check" aria-hidden>
              {n >= of && <FiCheck />}
            </span>
            <span>{text}</span>
            {of > 1 && (
              <span className="objective-count">
                {n}/{of}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="mission-actions">
        <button type="button" className="btn btn-ghost-ink btn-small" onClick={onReplay}>
          Replay the first-voyage tour
        </button>
        <button type="button" className="btn btn-ghost-ink btn-small" onClick={resetVoyage}>
          Reset voyage progress
        </button>
      </div>
    </div>
  );
}

function CourseButton({ id, onCourse }) {
  return (
    <button type="button" className="btn btn-ghost-ink btn-small" onClick={() => onCourse(id)}>
      <FiNavigation aria-hidden /> Set course
    </button>
  );
}

function Logbook({ onClose }) {
  const state = useGame();
  const [tab, setTab] = useState("Mission");
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onReplay = () => {
    onClose();
    if (!state.started) commands.start();
    startTour();
  };

  const onCourse = (id) => {
    onClose();
    if (!state.started) commands.start();
    commands.setCourse(id);
  };

  const list = (kind) =>
    pois
      .filter((p) => p.kind === kind)
      .map((p) => (
        <div key={p.id} className="log-entry">
          <div className="log-entry-head">
            <h3>{p.name}</h3>
            {state.visited.includes(p.id) ? (
              <span className="visited-badge">
                <FiCheck aria-hidden /> Visited
              </span>
            ) : (
              <CourseButton id={p.id} onCourse={onCourse} />
            )}
          </div>
          <Project project={p.project} compact />
        </div>
      ));

  return (
    <div className="scrim" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="sheet sheet-wide" role="dialog" aria-modal="true" aria-labelledby="logbook-title">
        <header className="sheet-head">
          <div>
            <p className="eyebrow eyebrow-ink">RV Sonu · Ship&apos;s logbook</p>
            <h2 id="logbook-title">{tab}</h2>
          </div>
          <button ref={closeRef} type="button" className="sheet-close" aria-label="Close logbook" onClick={onClose}>
            <FiX aria-hidden />
          </button>
        </header>

        <nav className="tabs" aria-label="Logbook sections">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`tab ${t === tab ? "is-active" : ""}`}
              aria-current={t === tab ? "page" : undefined}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="sheet-body">
          {tab === "Mission" && <Mission state={state} onReplay={onReplay} />}
          {tab === "Captain" && <About />}
          {tab === "Projects" && list("project")}
          {tab === "APIs" && list("api")}
          {tab === "Career" && <Timeline />}
          {tab === "Skills" && (
            <>
              <p className="panel-lede">
                {state.skills.length}/{buoys.length} buoys collected on this voyage. The
                faded ones are still out there.
              </p>
              <Skills collected={state.started ? state.skills : null} />
            </>
          )}
          {tab === "Contact" && <ContactForm />}
        </div>
      </section>
    </div>
  );
}

export default Logbook;
