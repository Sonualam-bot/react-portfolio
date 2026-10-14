import { useState } from "react";
import Desktop from "./os/Desktop";
import { BootScreen, OffScreen, SleepScreen } from "./os/screens";

const BOOT_KEY = "sonu-os-booted";

const hasBooted = () => {
  try {
    return sessionStorage.getItem(BOOT_KEY) === "1";
  } catch {
    return false;
  }
};

const rememberBoot = () => {
  try {
    sessionStorage.setItem(BOOT_KEY, "1");
  } catch {
    // Storage unavailable: the boot screen just shows again next time.
  }
};

function App() {
  // boot | desktop | sleep | off
  const [phase, setPhase] = useState(() => (hasBooted() ? "desktop" : "boot"));
  // Bumping the session remounts the desktop fresh, like a real restart.
  const [session, setSession] = useState(0);

  const restart = () => {
    setSession((s) => s + 1);
    setPhase("boot");
  };

  if (phase === "boot") {
    return (
      <BootScreen
        onDone={() => {
          rememberBoot();
          setPhase("desktop");
        }}
      />
    );
  }

  if (phase === "off") return <OffScreen onPowerOn={restart} />;

  return (
    <>
      <Desktop
        key={session}
        onLogOff={restart}
        onRestart={restart}
        onShutDown={() => setPhase("off")}
        onStandBy={() => setPhase("sleep")}
      />
      {phase === "sleep" && <SleepScreen onWake={() => setPhase("desktop")} />}
    </>
  );
}

export default App;
