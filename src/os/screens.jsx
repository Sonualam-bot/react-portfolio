import { useEffect, useRef } from "react";
import { LogoMark } from "./icons";

function useOnce(fn) {
  const done = useRef(false);
  return () => {
    if (done.current) return;
    done.current = true;
    fn();
  };
}

export function BootScreen({ onDone }) {
  const finish = useOnce(onDone);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(finish, reduced ? 700 : 2800);
    window.addEventListener("keydown", finish);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", finish);
    };
  });

  return (
    <div className="boot" onClick={finish} role="status" aria-label="Starting Sonu OS">
      <div className="boot-center">
        <div className="boot-logo">
          <span className="boot-mark">
            <LogoMark size={44} />
          </span>
          <div>
            <p className="boot-word">
              Sonu<span>OS</span>
            </p>
            <p className="boot-edition">Portfolio Edition</p>
          </div>
        </div>
        <div className="boot-progress" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
      <p className="boot-footer">
        <span>© {new Date().getFullYear()} Md Sonu Alam</span>
        <span>Press any key to skip</span>
      </p>
    </div>
  );
}

export function SleepScreen({ onWake }) {
  const wake = useOnce(onWake);
  useEffect(() => {
    window.addEventListener("keydown", wake);
    return () => window.removeEventListener("keydown", wake);
  });
  return (
    <button type="button" className="sleep" onClick={wake} aria-label="Wake up the computer">
      <span>Click anywhere or press a key to wake up</span>
    </button>
  );
}

export function OffScreen({ onPowerOn }) {
  return (
    <button type="button" className="off" onClick={onPowerOn}>
      <span className="off-message">It&apos;s now safe to close this tab.</span>
      <span className="off-hint">Or click anywhere to turn the computer back on.</span>
    </button>
  );
}
