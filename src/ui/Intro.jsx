import { useEffect } from "react";
import { commands } from "../game/bridge";

// The title card lives in index.html so it paints before any JavaScript
// loads (that's the page's largest paint). This just wires up its buttons
// and hides it once the voyage starts or the logbook opens.
function Intro({ hidden, onLogbook }) {
  useEffect(() => {
    const el = document.getElementById("intro");
    if (!el) return undefined;
    const onClick = (e) => {
      const action = e.target.closest("[data-intro]")?.dataset.intro;
      if (action === "start") commands.start();
      if (action === "logbook") onLogbook();
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [onLogbook]);

  useEffect(() => {
    const el = document.getElementById("intro");
    if (!el) return;
    el.hidden = hidden;
    if (!hidden) el.querySelector('[data-intro="start"]')?.focus();
  }, [hidden]);

  return null;
}

export default Intro;
