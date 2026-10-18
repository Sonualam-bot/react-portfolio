import { useEffect, useMemo } from "react";
import { FiArrowRight, FiNavigation } from "react-icons/fi";
import { commands, getState, onEvent, setState } from "../game/bridge";
import { pois, buoys } from "../game/world";
import { useGame } from "./useGame";

const TOUR_KEY = "sonar-tour-done";
const touch = () => window.matchMedia?.("(pointer: coarse)").matches;

const tourDone = () => {
  try {
    return localStorage.getItem(TOUR_KEY) === "1";
  } catch {
    return false;
  }
};

const finishTour = () => {
  try {
    localStorage.setItem(TOUR_KEY, "1");
  } catch {
    // Storage unavailable: the tour just offers itself again next visit.
  }
  setState({ tutorial: null, guide: null });
};

export const startTour = () => setState({ tutorial: 0 });

const nearestBuoy = (pos, skills) => {
  let best = null;
  for (const b of buoys) {
    if (skills.includes(b.name)) continue;
    const d = Math.hypot(b.pos.x - pos.x, b.pos.y - pos.y);
    if (!best || d < best.d) best = { b, d };
  }
  return best?.b ?? null;
};

// Each step waits for the player to really do the thing (`until` event).
const STEPS = [
  {
    until: "waypoint",
    title: "Plot your first course",
    body: () =>
      touch()
        ? "Tap the sea to drop waypoints and the autopilot plots a course around the islands. Drag a waypoint to move it; double-tap to delete it."
        : "Click the sea to drop waypoints and the autopilot plots a course around the islands. Drag one to move it, double-click to delete it. Prefer the wheel? W A S D or the arrow keys.",
  },
  {
    until: "ping",
    title: "Ping the sonar",
    body: () =>
      `Sonar charts every island its ring reaches and adds it to your minimap. ${touch() ? "Tap" : "Press Space or click"} Ping.`,
    highlight: "sonar",
  },
  {
    until: "collect",
    title: "Collect a skill",
    body: () =>
      `Every glowing buoy is a skill in my toolkit. Sail through the one the gold arrow marks. ${touch() ? "Tapping" : "Clicking"} near it plots the course.`,
    guide: "buoy",
  },
  {
    until: "dock",
    title: "Dock at an island",
    body: () =>
      `Islands hold the portfolio: projects, APIs, my career. ${touch() ? "Tap" : "Click"} an island and the autopilot sails to its jetty and docks.`,
    guide: "island",
  },
  {
    title: "The chart is yours, captain",
    body: () =>
      "The Next stop card always points somewhere new, and the Logbook keeps your objectives (plus everything in plain text). Fair winds!",
    highlight: "logbook",
    finish: "Let's sail",
  },
];

export const coachHighlight = (tutorial) => (tutorial === null ? null : STEPS[tutorial]?.highlight);

// Order the portfolio is best read in: home, work, APIs, career, then contact.
const KIND_ORDER = ["port", "project", "api", "lighthouse", "signal"];
const route = [...pois]
  .filter((p) => !p.hidden)
  .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));

// Where to suggest sailing after `current`: an unvisited place of the same
// kind first, then the next unvisited stop in reading order, else nowhere.
export const nextStopFor = (visited, current) => {
  const open = route.filter((p) => p.id !== current?.id && !visited.includes(p.id));
  return open.find((p) => p.kind === current?.kind) ?? open[0] ?? null;
};

const useNextStop = () => {
  const { visited, charted, skills, telemetry } = useGame();
  const buoy = useMemo(() => nearestBuoy(telemetry, skills), [telemetry, skills]);
  const stop = route.find((p) => !visited.includes(p.id));
  if (stop)
    return {
      id: stop.id,
      label: stop.kind === "lighthouse" ? `${stop.name} · ${stop.job.title}` : stop.name,
      region: stop.region,
      target: stop.pos,
    };
  if (!charted.includes("treasure"))
    return {
      id: "shoals",
      label: "Something glints in the south-west shoals…",
      region: "Rumour",
      target: { x: -50, y: -42 },
      noCourse: true,
    };
  if (!visited.includes("treasure"))
    return { id: "treasure", label: "Dive for the sunken chest", region: "Wreck", target: pois.at(-1).pos };
  if (buoy)
    return {
      id: `buoy-${buoy.name}`,
      label: `${buoys.length - skills.length} skills still adrift · nearest: ${buoy.name}`,
      region: "Skill buoy",
      target: buoy.pos,
      noCourse: true,
    };
  return null;
};

function Coach({ step, index }) {
  // Point the gold arrow at this step's target, chosen once when it starts.
  useEffect(() => {
    const { telemetry: t, skills: s, visited: v } = getState();
    let target = null;
    if (step.guide === "buoy") target = nearestBuoy(t, s)?.pos;
    if (step.guide === "island") {
      const port = pois.find((p) => p.kind === "port");
      target = (!v.includes(port.id) ? port : route.find((p) => !v.includes(p.id)))?.pos;
    }
    setState({ guide: target ? { x: target.x, y: target.y } : null });
  }, [step]);

  return (
    <div className="coach" role="status" aria-live="polite" key={index}>
      <div className="coach-head">
        <span className="coach-step">
          First voyage · {index + 1}/{STEPS.length}
        </span>
        {!step.finish && (
          <button type="button" className="coach-skip" onClick={finishTour}>
            Skip tour
          </button>
        )}
      </div>
      <h2>{step.title}</h2>
      <p>{step.body()}</p>
      <div className="coach-dots" aria-hidden>
        {STEPS.map((_, i) => (
          <span key={i} className={i <= index ? "is-on" : undefined} />
        ))}
      </div>
      {step.finish && (
        <button type="button" className="btn btn-primary btn-small coach-finish" onClick={finishTour}>
          {step.finish} <FiArrowRight aria-hidden />
        </button>
      )}
    </div>
  );
}

function NextStop() {
  const next = useNextStop();
  const id = next?.id;
  const x = next?.target.x;
  const y = next?.target.y;

  useEffect(() => {
    setState({ guide: id ? { x, y } : null });
  }, [id, x, y]);

  if (!next) return null;
  return (
    <div className="next-stop">
      <span className="next-stop-pin" aria-hidden />
      <div className="next-stop-text">
        <span className="next-stop-label">Next stop · {next.region}</span>
        <strong>{next.label}</strong>
      </div>
      {!next.noCourse && (
        <button
          type="button"
          className="next-stop-go"
          onClick={(e) => {
            commands.setCourse(next.id);
            e.currentTarget.blur();
          }}
        >
          <FiNavigation aria-hidden /> <span>Set course</span>
        </button>
      )}
    </div>
  );
}

// Runs the first-voyage tour once, then hands over to the Next stop tracker.
function Onboarding() {
  const { tutorial } = useGame();

  useEffect(() => {
    if (!tourDone()) startTour();
  }, []);

  useEffect(
    () =>
      onEvent((name) => {
        const { tutorial: index } = getState();
        if (index === null || STEPS[index]?.until !== name) return;
        // Let the moment land (sonar ring, sparkle) before the next card.
        setTimeout(() => setState({ tutorial: index + 1 }), 900);
      }),
    []
  );

  if (tutorial !== null && STEPS[tutorial]) return <Coach step={STEPS[tutorial]} index={tutorial} />;
  return <NextStop />;
}

export default Onboarding;
