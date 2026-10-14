import { useEffect, useRef } from "react";
import { iconFor } from "../icons";

function MessageBox({ icon = "info", message, close }) {
  const Icon = iconFor[icon];
  const okRef = useRef(null);
  useEffect(() => okRef.current?.focus(), []);

  return (
    <div className="msgbox">
      <div className="msgbox-body">
        <Icon size={32} />
        <p>{message}</p>
      </div>
      <div className="dialog-buttons">
        <button ref={okRef} type="button" className="xp-btn" onClick={close}>
          OK
        </button>
      </div>
    </div>
  );
}

export default MessageBox;
