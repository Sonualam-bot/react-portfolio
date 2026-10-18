// The one channel between the LittleJS game loop and the React HUD.
// The game writes snapshots here; React reads them with useSyncExternalStore
// and sends commands back through `commands`.

const SAVE_KEY = "sonar-voyage-v1";

const loadSave = () => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return {
      charted: data?.charted ?? [],
      visited: data?.visited ?? [],
      skills: data?.skills ?? [],
    };
  } catch {
    return { charted: [], visited: [], skills: [] };
  }
};

const saved = loadSave();

let state = {
  started: false,
  muted: false,
  panel: null, // { kind, id }
  prompt: null, // { label, verb } when the boat sits at a dock
  telemetry: { heading: 0, speed: 0, x: 0, y: 0, autopilot: false, current: false },
  sonarReady: true,
  charted: saved.charted,
  visited: saved.visited,
  skills: saved.skills,
  toasts: [],
  tutorial: null, // index into the onboarding steps while it runs
  guide: null, // { x, y } the gold arrow on the sea points at
};

const listeners = new Set();

export const getState = () => state;

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setState = (partial) => {
  state = { ...state, ...(typeof partial === "function" ? partial(state) : partial) };
  listeners.forEach((listener) => listener());
};

export const persist = () => {
  try {
    const { charted, visited, skills } = state;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ charted, visited, skills }));
  } catch {
    // Storage unavailable: progress lasts for this visit only.
  }
};

export const resetVoyage = () => {
  setState({ charted: [], visited: [], skills: [] });
  persist();
};

// One-off game moments ("ping", "waypoint", "collect", "dock") for the onboarding.
const eventListeners = new Set();
export const emit = (name) => eventListeners.forEach((listener) => listener(name));
export const onEvent = (listener) => {
  eventListeners.add(listener);
  return () => eventListeners.delete(listener);
};

let toastId = 0;
export const toast = (title, body, tone = "info") => {
  const id = ++toastId;
  setState((s) => ({ toasts: [...s.toasts, { id, title, body, tone }].slice(-3) }));
  setTimeout(() => setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4200);
};

// Filled in by the game once the engine is running. Until then (the engine
// boots after first paint) calls are queued and replayed on boot.
const queued = [];
const COMMANDS = ["ping", "setCourse", "dock", "clearRoute", "closePanel", "pause", "setMuted", "start", "zoom"];
let bootRequest = () => {};
export const onBootRequest = (handler) => (bootRequest = handler);
export const commands = Object.fromEntries(
  COMMANDS.map((name) => [
    name,
    (...args) => {
      queued.push([name, args]);
      // A real request (not the logbook's background pause) needs the engine,
      // even when it arrives without any pointer or key event first.
      if (name !== "pause") bootRequest();
    },
  ])
);
export const flushQueuedCommands = () => queued.splice(0).forEach(([name, args]) => commands[name](...args));
