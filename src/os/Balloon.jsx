import { useEffect } from "react";
import { iconFor } from "./icons";

// A tray notification balloon. Dismisses itself after a while.
function Balloon({ balloon, onClose }) {
  useEffect(() => {
    if (!balloon) return undefined;
    const timer = setTimeout(onClose, 9000);
    return () => clearTimeout(timer);
  }, [balloon, onClose]);

  if (!balloon) return null;
  const Icon = iconFor[balloon.icon ?? "info"];

  return (
    <div className="balloon" role="status">
      <button type="button" className="balloon-close" aria-label="Dismiss notification" onClick={onClose}>
        ×
      </button>
      <p className="balloon-title">
        <Icon size={16} />
        {balloon.title}
      </p>
      <p className="balloon-message">{balloon.message}</p>
    </div>
  );
}

export default Balloon;
