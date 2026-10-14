import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { RESUME_URL } from "../data/profile";
import { apps } from "./apps";
import Balloon from "./Balloon";
import { COMPACT_QUERY, OSContext, useActivation, useMediaQuery } from "./OSContext";
import StartMenu from "./StartMenu";
import Taskbar from "./Taskbar";
import TurnOffDialog from "./TurnOffDialog";
import Wallpaper from "./Wallpaper";
import Window from "./Window";
import { iconFor } from "./icons";

const desktopIcons = [
  { id: "about", label: "My Profile", icon: "profile" },
  { id: "projects", label: "My Projects", icon: "folder" },
  { id: "experience", label: "experience.txt", icon: "notepad" },
  { id: "skills", label: "Skills", icon: "disc" },
  { id: "contact", label: "Contact Me", icon: "mail" },
  { id: "resume", label: "Résumé.pdf", icon: "resume", href: RESUME_URL },
  { id: "recycle", label: "Recycle Bin", icon: "recycle" },
];

const topmost = (windows) => {
  const visible = windows.filter((w) => !w.minimized);
  return visible.length ? visible.reduce((a, b) => (a.z > b.z ? a : b)).key : null;
};

function reducer(state, action) {
  const update = (fn) => state.windows.map((w) => (w.key === action.key ? fn(w) : w));

  switch (action.type) {
    case "open": {
      const z = state.z + 1;
      if (state.windows.some((w) => w.key === action.key)) {
        return {
          ...state,
          z,
          focused: action.key,
          windows: update((w) => ({ ...w, z, minimized: false, props: action.props ?? w.props })),
        };
      }
      const app = apps[action.appId];
      const { w: areaW, h: areaH } = action.area;
      const w = Math.min(app.width, areaW - 16);
      const h = app.height ? Math.min(app.height, areaH - 16) : null;
      const cascade = (state.opened % 6) * 28;
      // Cascade from the center, but never past the bottom or right edge.
      const x = Math.max(8, Math.min(Math.round((areaW - w) / 2 - 60 + cascade), areaW - w - 8));
      const y = Math.max(8, Math.min(Math.round((areaH - (h ?? 200)) / 2 - 50 + cascade), areaH - (h ?? 200) - 8));
      return {
        ...state,
        z,
        opened: state.opened + 1,
        focused: action.key,
        windows: [
          ...state.windows,
          { key: action.key, appId: action.appId, props: action.props, x, y, w, h, z, minimized: false, maximized: false },
        ],
      };
    }
    case "close": {
      const windows = state.windows.filter((w) => w.key !== action.key);
      return { ...state, windows, focused: topmost(windows) };
    }
    case "focus": {
      const win = state.windows.find((w) => w.key === action.key);
      if (!win || (state.focused === action.key && win.z === state.z)) return state;
      const z = state.z + 1;
      return { ...state, z, focused: action.key, windows: update((w) => ({ ...w, z, minimized: false })) };
    }
    case "minimize": {
      const windows = update((w) => ({ ...w, minimized: true }));
      return { ...state, windows, focused: topmost(windows) };
    }
    case "toggleMax":
      return { ...state, windows: update((w) => ({ ...w, maximized: !w.maximized })) };
    case "move":
      return { ...state, windows: update((w) => ({ ...w, x: action.x, y: action.y })) };
    case "resize":
      return { ...state, windows: update((w) => ({ ...w, w: action.w, h: action.h })) };
    default:
      return state;
  }
}

function DesktopIcon({ item, selected, onSelect, onOpen }) {
  const handlers = useActivation(onSelect, onOpen);
  const Icon = iconFor[item.icon];
  return (
    <button
      type="button"
      className={`desktop-icon ${selected ? "is-selected" : ""}`}
      {...handlers}
    >
      <Icon size={40} />
      {/* Allow file names to wrap after the dot, not mid-word. */}
      <span className="desktop-icon-label">{item.label.replace(".", ".\u200b")}</span>
    </button>
  );
}

function Desktop({ onLogOff, onShutDown, onRestart, onStandBy }) {
  const isMobile = useMediaQuery(COMPACT_QUERY);
  const [state, dispatch] = useReducer(reducer, { windows: [], z: 10, opened: 0, focused: null });
  const [startOpen, setStartOpen] = useState(false);
  const [turnOffOpen, setTurnOffOpen] = useState(false);
  const [balloon, setBalloon] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const areaRef = useRef(null);
  const startButtonRef = useRef(null);

  const open = useCallback((appId, props, key = appId) => {
    const rect = areaRef.current?.getBoundingClientRect();
    dispatch({
      type: "open",
      appId,
      props,
      key,
      area: { w: rect?.width ?? window.innerWidth, h: rect?.height ?? window.innerHeight - 30 },
    });
    setStartOpen(false);
  }, []);

  const notify = useCallback((next) => setBalloon({ ...next, id: Date.now() }), []);
  const closeBalloon = useCallback(() => setBalloon(null), []);
  const closeStart = useCallback(() => setStartOpen(false), []);

  const welcome = useCallback(
    () =>
      notify({
        title: "Welcome to Sonu OS",
        message: isMobile
          ? "Tap an icon to open it. My Projects is a good place to start."
          : "Double-click a desktop icon to open it. My Projects is a good place to start.",
      }),
    [isMobile, notify]
  );

  useEffect(() => {
    if (!window.matchMedia(COMPACT_QUERY).matches) open("about");
    const timer = setTimeout(welcome, 900);
    return () => clearTimeout(timer);
    // Run once per session start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTask = (key) => {
    const win = state.windows.find((w) => w.key === key);
    if (!win) return;
    if (state.focused === key && !win.minimized) dispatch({ type: "minimize", key });
    else dispatch({ type: "focus", key });
  };

  const openIcon = (item) => {
    if (item.href) window.open(item.href, "_blank", "noopener,noreferrer");
    else open(item.id);
  };

  const os = useMemo(() => ({ open, notify, isMobile }), [open, notify, isMobile]);

  return (
    <OSContext.Provider value={os}>
      <div className={`desktop ${turnOffOpen ? "is-fading" : ""}`}>
        <Wallpaper />

        <div
          className="desktop-area"
          ref={areaRef}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setSelectedIcon(null);
          }}
        >
          <nav className="desktop-icons" aria-label="Desktop">
            {desktopIcons.map((item) => (
              <DesktopIcon
                key={item.id}
                item={item}
                selected={selectedIcon === item.id}
                onSelect={() => setSelectedIcon(item.id)}
                onOpen={() => openIcon(item)}
              />
            ))}
          </nav>

          {state.windows.map((win) => {
            const App = apps[win.appId].Component;
            return (
              <Window
                key={win.key}
                win={win}
                active={state.focused === win.key}
                isMobile={isMobile}
                dispatch={dispatch}
              >
                <App {...win.props} close={() => dispatch({ type: "close", key: win.key })} />
              </Window>
            );
          })}
        </div>

        {startOpen && (
          <StartMenu
            onClose={closeStart}
            startButtonRef={startButtonRef}
            onLogOff={onLogOff}
            onTurnOff={() => {
              setStartOpen(false);
              setTurnOffOpen(true);
            }}
          />
        )}

        <Balloon balloon={balloon} onClose={closeBalloon} />

        <Taskbar
          ref={startButtonRef}
          windows={state.windows}
          focused={state.focused}
          startOpen={startOpen}
          onToggleStart={() => setStartOpen((o) => !o)}
          onTask={onTask}
          onTrayClick={welcome}
        />
      </div>

      {turnOffOpen && (
        <TurnOffDialog
          onCancel={() => setTurnOffOpen(false)}
          onStandBy={() => {
            setTurnOffOpen(false);
            onStandBy();
          }}
          onTurnOff={onShutDown}
          onRestart={onRestart}
        />
      )}
    </OSContext.Provider>
  );
}

export default Desktop;
