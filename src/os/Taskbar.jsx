import { forwardRef, useEffect, useState } from "react";
import { iconOf, titleOf } from "./apps";
import { LogoMark, iconFor } from "./icons";

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(timer);
  }, []);
  return (
    <time
      className="tray-clock"
      dateTime={now.toISOString()}
      title={now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
    >
      {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
    </time>
  );
}

const Taskbar = forwardRef(function Taskbar(
  { windows, focused, startOpen, onToggleStart, onTask, onTrayClick },
  startButtonRef
) {
  return (
    <footer className="taskbar">
      <button
        ref={startButtonRef}
        type="button"
        className={`start-button ${startOpen ? "is-open" : ""}`}
        aria-expanded={startOpen}
        aria-controls="start-menu"
        onClick={onToggleStart}
      >
        <LogoMark size={18} />
        <span>start</span>
      </button>

      <ul className="task-list" aria-label="Open windows">
        {windows.map((win) => {
          const Icon = iconFor[iconOf(win)];
          const title = titleOf(win);
          const isActive = focused === win.key && !win.minimized;
          return (
            <li key={win.key}>
              <button
                type="button"
                className={`task ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
                title={title}
                onClick={() => onTask(win.key)}
              >
                <Icon size={16} />
                <span className="task-label">{title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="tray">
        <button type="button" className="tray-icon" aria-label="Show tips" onClick={onTrayClick}>
          <iconFor.info size={16} />
        </button>
        <Clock />
      </div>
    </footer>
  );
});

export default Taskbar;
