import { useEffect, useRef } from "react";
import { LogoMark, PowerIcon, RestartIcon, StandByIcon } from "./icons";

function TurnOffDialog({ onCancel, onStandBy, onTurnOff, onRestart }) {
  const turnOffRef = useRef(null);

  useEffect(() => {
    turnOffRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div className="turnoff-backdrop">
      <div className="turnoff" role="alertdialog" aria-modal="true" aria-labelledby="turnoff-title">
        <header className="turnoff-header">
          <h2 id="turnoff-title">Turn off computer</h2>
          <LogoMark size={26} />
        </header>
        <div className="turnoff-body">
          <button type="button" className="turnoff-option" onClick={onStandBy}>
            <StandByIcon size={34} />
            <span>Stand By</span>
          </button>
          <button ref={turnOffRef} type="button" className="turnoff-option" onClick={onTurnOff}>
            <PowerIcon size={34} />
            <span>Turn Off</span>
          </button>
          <button type="button" className="turnoff-option" onClick={onRestart}>
            <RestartIcon size={34} />
            <span>Restart</span>
          </button>
        </div>
        <footer className="turnoff-footer">
          <button type="button" className="xp-btn" onClick={onCancel}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}

export default TurnOffDialog;
