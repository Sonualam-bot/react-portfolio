import { useCallback, useEffect, useRef, useState } from "react";
import { startGame } from "./game/game";
import { commands } from "./game/bridge";
import Hud from "./ui/Hud";
import Intro from "./ui/Intro";
import Panel from "./ui/Panel";
import Logbook from "./ui/Logbook";
import { useGame } from "./ui/useGame";

function App() {
  const seaRef = useRef(null);
  const { started, panel } = useGame();
  const [logbook, setLogbook] = useState(false);

  useEffect(() => startGame(seaRef.current), []);

  // The sea holds still while the logbook is open.
  useEffect(() => {
    if (panel) return;
    commands.pause(logbook);
  }, [logbook, panel]);

  const closeLogbook = useCallback(() => setLogbook(false), []);

  return (
    <>
      <div className="sea" ref={seaRef} />
      {started && <Hud onLogbook={() => setLogbook(true)} />}
      {!started && !logbook && <Intro onLogbook={() => setLogbook(true)} />}
      {panel && <Panel panel={panel} />}
      {logbook && <Logbook onClose={closeLogbook} />}
    </>
  );
}

export default App;
