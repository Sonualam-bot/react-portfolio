import { useEffect, useRef } from "react";
import { commands } from "../game/bridge";
import { pois } from "../game/world";
import { useGame } from "./useGame";

// The last three need a keyboard, so small screens hide them.
const controls = [
  ["Click / tap the sea", "Add waypoints. Drag one to move it, double-click to delete."],
  ["Click an island", "Autopilot sails you to its jetty."],
  ["Ping", "Sonar charts everything the ring touches."],
  ["W A S D / arrows", "Take the wheel yourself.", true],
  ["Space", "Sonar ping.", true],
  ["E", "Dock when you're alongside.", true],
];

function Intro({ onLogbook }) {
  const { charted } = useGame();
  const startRef = useRef(null);
  const resuming = charted.length > 1;

  useEffect(() => startRef.current?.focus(), []);

  return (
    <div className="intro">
      <div className="intro-card">
        <p className="eyebrow">A playable portfolio</p>
        <h1 className="intro-title">
          Sonar<span>.</span>
        </h1>
        <p className="intro-name">Md Sonu Alam · Software Engineer</p>
        <p className="intro-lede">
          By day I build mission-planning and vessel-telemetry software for marine
          GIS at RekiSe Marine. So my portfolio is a survey vessel. Take the helm,
          chart the archipelago, and collect every skill buoy on the way.
        </p>

        <ul className="intro-controls">
          {controls.map(([key, what, keyboard]) => (
            <li key={key} className={keyboard ? "is-keyboard" : undefined}>
              <span className="intro-key">{key}</span>
              <span>{what}</span>
            </li>
          ))}
        </ul>

        <div className="intro-actions">
          <button ref={startRef} type="button" className="btn btn-primary" onClick={() => commands.start()}>
            {resuming ? `Resume voyage · ${charted.length}/${pois.length} charted` : "Take the helm"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onLogbook}>
            Just read the logbook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Intro;
