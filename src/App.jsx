import { useCallback, useEffect, useRef, useState } from "react";
import { commands, onBootRequest } from "./game/bridge";
import Hud from "./ui/Hud";
import Intro from "./ui/Intro";
import Panel from "./ui/Panel";
import Logbook from "./ui/Logbook";
import { useGame } from "./ui/useGame";

function App() {
  const seaRef = useRef(null);
  const { started, panel } = useGame();
  const [logbook, setLogbook] = useState(false);

  // The engine (and its 60fps loop) only loads once the visitor interacts.
  // Until then a static chart sits behind the title card, so the page
  // paints fast and stays idle; commands sent meanwhile are queued.
  useEffect(() => {
    const events = ["pointerdown", "pointermove", "keydown", "touchstart", "wheel"];
    let booting = false;
    const boot = () => {
      if (booting) return;
      booting = true;
      events.forEach((e) => window.removeEventListener(e, boot));
      import("./game/game").then(({ startGame }) => startGame(seaRef.current));
    };
    events.forEach((e) => window.addEventListener(e, boot, { passive: true }));
    onBootRequest(boot);
    return () => {
      events.forEach((e) => window.removeEventListener(e, boot));
      onBootRequest(() => {});
    };
  }, []);

  // The sea holds still while the logbook is open..
  useEffect(() => {
    if (panel) return;
    commands.pause(logbook);
  }, [logbook, panel]);

  const openLogbook = useCallback(() => setLogbook(true), []);
  const closeLogbook = useCallback(() => setLogbook(false), []);

  return (
    <>
      <div className="sea" ref={seaRef} />
      {started && <Hud onLogbook={() => setLogbook(true)} />}
      <Intro hidden={started || logbook} onLogbook={openLogbook} />
      {panel && <Panel panel={panel} />}
      {logbook && <Logbook onClose={closeLogbook} />}
    </>
  );
}

export default App;
