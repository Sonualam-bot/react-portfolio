import { useSyncExternalStore } from "react";
import { FiBookOpen, FiMinus, FiPlus, FiVolume2, FiVolumeX, FiXCircle } from "react-icons/fi";
import { commands } from "../game/bridge";
import { pois, buoys, toLatLon } from "../game/world";
import { useGame } from "./useGame";
import Minimap from "./Minimap";
import Onboarding, { coachHighlight } from "./Onboarding";

const pad = (n, size) => String(Math.round(n)).padStart(size, "0");

const formatCoord = (value, pos, neg) => {
  const deg = Math.floor(Math.abs(value));
  const min = (Math.abs(value) - deg) * 60;
  return `${deg}°${min.toFixed(2).padStart(5, "0")}′${value >= 0 ? pos : neg}`;
};

function Telemetry() {
  const { telemetry: t } = useGame();
  const { lat, lon } = toLatLon({ x: t.x, y: t.y });
  return (
    <dl className="telemetry" aria-label="Vessel telemetry">
      <div>
        <dt>HDG</dt>
        <dd>{pad(t.heading, 3)}°</dd>
      </div>
      <div>
        <dt>SPD</dt>
        <dd>{t.speed.toFixed(1)} kn</dd>
      </div>
      <div className="telemetry-pos">
        <dt>POS</dt>
        <dd>
          {formatCoord(lat, "N", "S")} {formatCoord(lon, "E", "W")}
        </dd>
      </div>
      <div className="telemetry-mode">
        <dt>MODE</dt>
        <dd className={t.autopilot ? "is-auto" : undefined}>
          {t.autopilot ? `AUTO · ${t.routeNm.toFixed(1)} nm` : "MANUAL"}
          {t.current && <span className="telemetry-current"> · CURRENT</span>}
        </dd>
      </div>
    </dl>
  );
}

function Progress() {
  const { charted, visited, skills } = useGame();
  const rows = [
    ["Charted", charted.length, pois.length],
    ["Docked", visited.length, pois.length],
    ["Skills", skills.length, buoys.length],
  ];
  return (
    <ul className="progress" aria-label="Voyage progress">
      {rows.map(([label, n, total]) => (
        <li key={label}>
          <span>{label}</span>
          <span className="progress-bar" aria-hidden>
            <span style={{ width: `${(n / total) * 100}%` }} />
          </span>
          <span className="progress-num">
            {n}/{total}
          </span>
        </li>
      ))}
    </ul>
  );
}

const PHONE = "(max-width: 760px)";
const usePhone = () =>
  useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(PHONE);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(PHONE).matches
  );

function DockPrompt({ inline = false }) {
  const { prompt, panel } = useGame();
  if (!prompt || panel) return null;
  return (
    <button type="button" className={`dock-prompt${inline ? " is-inline" : ""}`} onClick={() => commands.dock()}>
      <kbd>E</kbd>
      <span>
        {prompt.verb} <strong>{prompt.name}</strong>
      </span>
    </button>
  );
}

function Toasts() {
  const { toasts } = useGame();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone}`}>
          <strong>{t.title}</strong>
          {t.body && <span>{t.body}</span>}
        </div>
      ))}
    </div>
  );
}

const coached = (on) => (on ? " is-coached" : "");

function Hud({ onLogbook }) {
  const { muted, sonarReady, tutorial, telemetry } = useGame();
  const highlight = coachHighlight(tutorial);
  const phone = usePhone();
  // Buttons hand focus straight back so Space keeps pinging, not re-clicking.
  const act = (fn) => (e) => {
    fn();
    e.currentTarget.blur();
  };

  return (
    <div className="hud">
      <header className="hud-top">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <h1>RV Sonu</h1>
            <p>Survey vessel · Md Sonu Alam</p>
          </div>
        </div>
        <Telemetry />
        <div className="hud-actions">
          <button type="button" className={`hud-btn${coached(highlight === "logbook")}`} onClick={act(onLogbook)}>
            <FiBookOpen aria-hidden />
            <span>Logbook</span>
          </button>
          <button
            type="button"
            className="hud-btn is-icon"
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            onClick={act(() => commands.setMuted(!muted))}
          >
            {muted ? <FiVolumeX aria-hidden /> : <FiVolume2 aria-hidden />}
          </button>
        </div>
      </header>

      <aside className="hud-chart">
        <Minimap />
        <Progress />
      </aside>

      <div className="hud-controls">
        {telemetry.autopilot && (
          <button type="button" className="hud-btn clear-route" onClick={act(() => commands.clearRoute())}>
            <FiXCircle aria-hidden />
            <span>Clear route</span>
          </button>
        )}
        <button type="button" className="hud-btn is-icon" aria-label="Zoom in" onClick={act(() => commands.zoom(1))}>
          <FiPlus aria-hidden />
        </button>
        <button type="button" className="hud-btn is-icon" aria-label="Zoom out" onClick={act(() => commands.zoom(-1))}>
          <FiMinus aria-hidden />
        </button>
        <button
          type="button"
          className={`sonar-btn ${sonarReady ? "is-ready" : ""}${coached(highlight === "sonar")}`}
          onClick={act(() => commands.ping())}
          disabled={!sonarReady}
        >
          <span className="sonar-btn-ring" aria-hidden />
          <span>Ping</span>
          <kbd>Space</kbd>
        </button>
      </div>

      <div className="hud-center">
        <Onboarding />
        {phone && <DockPrompt inline />}
        <Toasts />
      </div>
      {!phone && <DockPrompt />}
    </div>
  );
}

export default Hud;
