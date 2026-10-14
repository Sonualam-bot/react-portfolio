import { useEffect, useRef } from "react";
import { apps, iconOf, titleOf } from "./apps";
import { iconFor } from "./icons";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const MIN_W = 300;
const MIN_H = 180;

function ControlGlyph({ kind }) {
  const common = { width: 11, height: 11, viewBox: "0 0 11 11", "aria-hidden": true };
  if (kind === "min") return <svg {...common}><rect x="1" y="8" width="6" height="2.5" fill="#fff" /></svg>;
  if (kind === "max")
    return <svg {...common}><rect x="1" y="1" width="9" height="9" fill="none" stroke="#fff" strokeWidth="1.2" /><rect x="1" y="1" width="9" height="2.6" fill="#fff" /></svg>;
  if (kind === "restore")
    return (
      <svg {...common}>
        <rect x="3.5" y="0.5" width="7" height="6.5" fill="none" stroke="#fff" />
        <rect x="3.5" y="0.5" width="7" height="2" fill="#fff" />
        <rect x="0.6" y="3.6" width="7" height="6.8" fill="#2a63dd" stroke="#fff" />
        <rect x="0.6" y="3.6" width="7" height="2" fill="#fff" />
      </svg>
    );
  return <svg {...common}><path d="M1.5 1.5l8 8m0-8l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>;
}

function Window({ win, active, isMobile, dispatch, children }) {
  const ref = useRef(null);
  const gesture = useRef(null);
  const app = apps[win.appId];
  // On phones, app windows fill the screen; small dialogs stay centered.
  const maximized = win.maximized || (isMobile && app.resizable !== false);
  const resizable = app.resizable !== false && !maximized;
  const title = titleOf(win);
  const Icon = iconFor[iconOf(win)];
  const key = win.key;

  // New windows take focus so keyboard users land inside them, unless the
  // app already focused something of its own (child effects run first).
  useEffect(() => {
    const el = ref.current;
    if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
  }, []);

  const begin = (kind) => (e) => {
    if (e.button !== 0 || maximized) return;
    if (kind === "move" && e.target.closest("button")) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = {
      kind,
      startX: e.clientX,
      startY: e.clientY,
      x: win.x,
      y: win.y,
      w: ref.current.offsetWidth,
      h: ref.current.offsetHeight,
    };
  };

  // Track the pointer directly on the DOM (1:1, no re-render per frame),
  // then commit the final position to state when the drag ends.
  const track = (e) => {
    const g = gesture.current;
    if (!g) return;
    const el = ref.current;
    const area = el.parentElement.getBoundingClientRect();
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (g.kind === "move") {
      // Keep enough of the title bar on screen to grab it again.
      g.nx = clamp(g.x + dx, 80 - g.w, area.width - 80);
      g.ny = clamp(g.y + dy, 0, area.height - 28);
      el.style.transform = `translate(${g.nx}px, ${g.ny}px)`;
    } else {
      g.nw = clamp(g.w + dx, MIN_W, area.width - g.x);
      g.nh = clamp(g.h + dy, MIN_H, area.height - g.y);
      el.style.width = `${g.nw}px`;
      el.style.height = `${g.nh}px`;
    }
  };

  const end = () => {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    if (g.kind === "move" && g.nx !== undefined) dispatch({ type: "move", key, x: g.nx, y: g.ny });
    if (g.kind === "resize" && g.nw !== undefined) dispatch({ type: "resize", key, w: g.nw, h: g.nh });
  };

  const style = maximized
    ? { zIndex: win.z }
    : {
        zIndex: win.z,
        transform: `translate(${win.x}px, ${win.y}px)`,
        width: win.w,
        height: win.h ?? "auto",
      };

  return (
    <section
      ref={ref}
      role="dialog"
      aria-labelledby={`${key}-title`}
      tabIndex={-1}
      hidden={win.minimized}
      className={`os-window ${active ? "is-active" : ""} ${maximized ? "is-maximized" : ""}`}
      style={style}
      onPointerDownCapture={() => dispatch({ type: "focus", key })}
      onFocusCapture={() => dispatch({ type: "focus", key })}
    >
      <header
        className="titlebar"
        onPointerDown={begin("move")}
        onPointerMove={track}
        onPointerUp={end}
        onPointerCancel={end}
        onDoubleClick={(e) => {
          if (!isMobile && app.resizable !== false && !e.target.closest("button")) {
            dispatch({ type: "toggleMax", key });
          }
        }}
      >
        <Icon size={16} />
        <h2 id={`${key}-title`} className="titlebar-text">
          {title}
        </h2>
        <div className="titlebar-controls">
          <button type="button" className="ctl" aria-label="Minimize" onClick={() => dispatch({ type: "minimize", key })}>
            <ControlGlyph kind="min" />
          </button>
          {!isMobile && app.resizable !== false && (
            <button
              type="button"
              className="ctl"
              aria-label={win.maximized ? "Restore" : "Maximize"}
              onClick={() => dispatch({ type: "toggleMax", key })}
            >
              <ControlGlyph kind={win.maximized ? "restore" : "max"} />
            </button>
          )}
          <button type="button" className="ctl ctl-close" aria-label="Close" onClick={() => dispatch({ type: "close", key })}>
            <ControlGlyph kind="close" />
          </button>
        </div>
      </header>

      <div className="window-body">{children}</div>

      {resizable && (
        <div
          className="resize-grip"
          aria-hidden
          onPointerDown={begin("resize")}
          onPointerMove={track}
          onPointerUp={end}
          onPointerCancel={end}
        />
      )}
    </section>
  );
}

export default Window;
