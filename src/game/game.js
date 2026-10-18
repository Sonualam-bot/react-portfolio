import {
  PI, abs, clamp, lerp, max, min, sin, vec2, rgb,
  Color, RandomGenerator,
  engineInit, setPaused, inputClear, timeReal, timeDelta, frame,
  cameraPos, cameraScale, setCameraPos, setCameraScale, getCameraSize, mainCanvasSize,
  setCanvasClearColor, setCanvasPixelRatio, setCanvasMaxSize, setShowSplashScreen, setInputPreventDefault, setFontDefault,
  setTouchGamepadEnable, setDebugWatermark, setDebugKey,
  keyDirection, keyWasPressed, mouseWasPressed, mouseIsDown, mousePos, mousePosScreen,
  drawRect, drawPoly, drawLine, drawCircle, drawEllipse, drawCircleGradient, drawRegularPoly,
  drawText, drawTextScreen, worldToScreen, screenToWorld, isOnScreen, setAdditiveBlendMode,
} from "littlejsengine";
import {
  WORLD, START, pois, poiById, dockPoint, coastRadius, buoys, currentPath, CURRENT,
} from "./world";
import { planPath, nearestWater } from "./navigation";
import { play, setMutedAudio } from "./audio";
import { commands, emit, flushQueuedCommands, getState, persist, setState, toast } from "./bridge";

const hex = (h, a = 1) => new Color().setHex(h).withAlpha(a);
const CLEAR = rgb(0, 0, 0, 0);

const C = {
  sea: hex("#0a2a3d"),
  seaLight: hex("#1d5470"),
  seaDark: hex("#061a28"),
  grid: hex("#7fd6e8", 0.07),
  wave: hex("#bfefff"),
  shallow: hex("#2fb5b8"),
  sand: hex("#e9d6a6"),
  sandDark: hex("#c9b07c"),
  grass: hex("#4f9a6a"),
  grassDark: hex("#3a7a55"),
  palm: hex("#2f6b46"),
  wood: hex("#8a5a3b"),
  lagoon: hex("#47d1c6"),
  sonar: hex("#5cffb0"),
  foam: hex("#e8fbff"),
  hull: hex("#f4f1ea"),
  deck: hex("#c98b4f"),
  cabin: hex("#ffffff"),
  ink: hex("#04121c"),
  route: hex("#ffd166"),
  lamp: hex("#ffe08a"),
  red: hex("#ff5d5d"),
  green: hex("#47e08a"),
  label: hex("#f4ecd6"),
  roof: hex("#d9694a"),
};
const FLAG_COLORS = ["#ff7a59", "#ffd166", "#7bdff2", "#c792ea", "#9be564", "#ff9ec7"].map((h) => hex(h));

const LABEL_FONT = "Fraunces, Georgia, serif";
const MONO_FONT = "'IBM Plex Mono', ui-monospace, monospace";

// --- Vessel & effects -----------------------------------------------------

const boat = { pos: START.pos.copy(), angle: START.angle, speed: 0, vel: vec2() };
let pings = []; // sonar rings
let blips = []; // discovery flashes
let foam = [];
let sparks = [];
let floaters = [];
let started = false;
let zoom = 1;
let pingCooldown = 0;
let bumpCooldown = 0;
let promptId = null;
let completeShown = false;
let pressOnSea = false;
let seaRoot = null;
let inCurrent = false;

const SONAR_RANGE = 46;
const SONAR_TIME = 1.9;
const MAX_SPEED = 9;
// Render at the screen's real density (capped at 2x to stay light on phones).
const PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, 2);
const DPR = () => PIXEL_RATIO;

// Static decoration seeded once: soft depth patches and shoal rocks.
const rng = new RandomGenerator(42);
const patches = Array.from({ length: 70 }, () => ({
  pos: vec2(rng.float(WORLD.minX, WORLD.maxX), rng.float(WORLD.minY, WORLD.maxY)),
  size: rng.float(10, 26),
  light: rng.bool(0.55),
}));
const rocks = Array.from({ length: 14 }, () => ({
  pos: vec2(-54, -38).add(vec2().setAngle(rng.angle(), rng.float(2.5, 9))),
  size: rng.float(0.4, 1.1),
  angle: rng.angle(),
}));

// Precompute the current polyline for sampling and projection.
const currentSegs = [];
let currentLength = 0;
for (let i = 0; i < currentPath.length - 1; i++) {
  const a = currentPath[i];
  const b = currentPath[i + 1];
  const len = a.distance(b);
  currentSegs.push({ a, b, len, dir: b.subtract(a).normalize(), start: currentLength });
  currentLength += len;
}
const sampleCurrent = (s) => {
  const seg = currentSegs.find((g) => s <= g.start + g.len) ?? currentSegs.at(-1);
  return { pos: seg.a.add(seg.dir.scale(s - seg.start)), dir: seg.dir };
};

const wrapAngle = (a) => {
  a %= PI * 2;
  if (a > PI) a -= PI * 2;
  if (a < -PI) a += PI * 2;
  return a;
};
const hash = (x, y, k = 0) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + k * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

// --- Progress ------------------------------------------------------------

const isCharted = (id) => getState().charted.includes(id);

const chart = (p) => {
  if (isCharted(p.id)) return;
  setState((s) => ({ charted: [...s.charted, p.id] }));
  persist();
  blips.push({ pos: p.pos, t: timeReal, size: p.radius * 2 + 4 });
  play("blip", 1, p.hidden ? 0.6 : 1);
  toast(p.hidden ? "Something glints below…" : `Charted: ${p.name}`, p.hidden ? "Sail over the X to dive." : p.region, p.hidden ? "gold" : "info");
};

const openPanel = (p) => {
  clearRoute();
  boat.speed *= 0.2;
  chart(p);
  play("dock");
  setState((s) => ({
    panel: { kind: p.kind, id: p.id },
    visited: s.visited.includes(p.id) ? s.visited : [...s.visited, p.id],
  }));
  persist();
  setPaused(true);
  emit("dock");
};

const collect = (b) => {
  setState((s) => ({ skills: [...s.skills, b.name] }));
  persist();
  play("collect", 1, 1 + getState().skills.length * 0.012);
  const color = hex(b.color);
  for (let i = 0; i < 16; i++)
    sparks.push({ pos: b.pos.copy(), vel: vec2().setAngle((i / 16) * PI * 2, 4 + (i % 3)), t: timeReal, color });
  floaters.push({ text: `+ ${b.name}`, pos: b.pos.copy(), t: timeReal, color });
  emit("collect");
  const n = getState().skills.length;
  if (n === 1) toast("Skill collected!", "Each buoy is a tool in the kit. Collect them all.", "good");
  else if (n === buoys.length) toast("Full kit!", `All ${n} skills aboard.`, "gold");
};

const checkComplete = () => {
  if (completeShown) return;
  const s = getState();
  if (s.charted.length >= pois.length && s.skills.length >= buoys.length) {
    completeShown = true;
    play("fanfare");
    setState({ panel: { kind: "complete", id: "complete" } });
    setPaused(true);
  }
};

// --- Input ---------------------------------------------------------------

const hitPoi = (pos) =>
  pois.find((p) => (!p.hidden || isCharted(p.id)) && pos.distance(p.pos) < p.hitRadius);

// --- Route: your waypoints, each reached by a leg planned around islands ---

let plan = []; // waypoints you placed: [{ pos, dock? }]
let legs = []; // legs[i] = points the boat sails through to reach plan[i]
let drag = null; // { index, start (screen px), moved } while a waypoint is held
let lastTap = { index: -1, t: 0 };
let progress = { best: Infinity, t: 0 };
const MAX_WAYPOINTS = 12;

const replan = (from = 0) => {
  for (let i = from; i < plan.length; i++) legs[i] = planPath(i ? plan[i - 1].pos : boat.pos, plan[i].pos);
  legs.length = plan.length;
  progress = { best: Infinity, t: timeReal };
};

const clearRoute = () => {
  plan = [];
  legs = [];
  drag = null;
};

const clampWorld = (pos) =>
  vec2(clamp(pos.x, WORLD.minX + 2, WORLD.maxX - 2), clamp(pos.y, WORLD.minY + 2, WORLD.maxY - 2));

const setCourseTo = (p) => {
  plan = [{ pos: dockPoint(p, 1.4), dock: p.id }];
  replan();
  play("waypoint", 1, 0.8);
  emit("waypoint");
};

const addWaypoint = (pos) => {
  // A new waypoint after an island course means "go somewhere else instead".
  if (plan.at(-1)?.dock) clearRoute();
  if (plan.length >= MAX_WAYPOINTS) return;
  plan.push({ pos: nearestWater(clampWorld(pos)) });
  replan(plan.length - 1);
  play("waypoint");
  emit("waypoint");
};

const deleteWaypoint = (i) => {
  plan.splice(i, 1);
  replan(i);
  play("waypoint", 0.8, 0.6);
};

const waypointAt = (pos) => {
  let best = -1;
  let bestD = max(1.3, (22 * DPR()) / cameraScale);
  plan.forEach((w, i) => {
    const d = w.pos.distance(pos);
    if (d < bestD) [best, bestD] = [i, d];
  });
  return best;
};

// Click the sea to add a waypoint, click an island to sail to its jetty,
// drag a waypoint to move it, double-click (or double-tap) one to delete it,
// right-click to clear the route.
const handlePointer = () => {
  if (mouseWasPressed(0) && pressOnSea) {
    const i = waypointAt(mousePos);
    if (i >= 0) {
      if (lastTap.index === i && timeReal - lastTap.t < 0.4) {
        deleteWaypoint(i);
        lastTap = { index: -1, t: 0 };
      } else {
        lastTap = { index: i, t: timeReal };
        drag = { index: i, start: mousePosScreen.copy(), moved: false };
      }
    } else {
      const p = hitPoi(mousePos);
      if (p) setCourseTo(p);
      else addWaypoint(mousePos);
    }
  }

  if (drag) {
    const w = plan[drag.index];
    if (!w) drag = null;
    else if (mouseIsDown(0)) {
      // Measured on screen: the camera keeps drifting with the boat, so a
      // perfectly still press still slides across the world underneath.
      if (!drag.moved && mousePosScreen.distance(drag.start) > 6 * DPR()) drag.moved = true;
      if (drag.moved) {
        w.pos = clampWorld(mousePos);
        delete w.dock;
        // Straight preview while held; the real legs are planned on release.
        legs[drag.index] = [w.pos];
        if (plan[drag.index + 1]) legs[drag.index + 1] = [plan[drag.index + 1].pos];
      }
    } else {
      if (drag.moved) {
        w.pos = nearestWater(w.pos);
        replan(drag.index);
        play("waypoint", 1, 1.2);
        lastTap = { index: -1, t: 0 };
      }
      drag = null;
    }
  }

  if (mouseWasPressed(2) && pressOnSea) clearRoute();

  if (seaRoot) {
    const cursor = drag?.moved ? "grabbing" : waypointAt(mousePos) >= 0 ? "grab" : hitPoi(mousePos) ? "pointer" : "";
    if (seaRoot.style.cursor !== cursor) seaRoot.style.cursor = cursor;
  }
};

const ping = () => {
  if (pingCooldown > 0 || !started) return;
  pingCooldown = 2.4;
  pings.push({ pos: boat.pos.copy(), t: timeReal, hit: new Set() });
  play("ping");
  emit("ping");
};

const nearestDock = () => {
  let best = null;
  let bestD = 3.4;
  for (const p of pois) {
    if (p.hidden && !isCharted(p.id)) continue;
    const d = boat.pos.distance(p.hidden ? p.pos : dockPoint(p));
    if (d < bestD) [best, bestD] = [p, d];
  }
  return best;
};

// --- Simulation ----------------------------------------------------------

const currentPush = () => {
  let best = null;
  for (const g of currentSegs) {
    const t = clamp(boat.pos.subtract(g.a).dot(g.dir), 0, g.len);
    const d = boat.pos.distance(g.a.add(g.dir.scale(t)));
    if (!best || d < best.d) best = { d, dir: g.dir };
  }
  if (best.d > CURRENT.width) return vec2();
  return best.dir.scale(CURRENT.strength * (1 - best.d / CURRENT.width) ** 0.5);
};

const autopilot = () => {
  if (!legs[0]?.length) replan();
  const leg = legs[0];
  const target = leg[0];
  const to = target.subtract(boat.pos);
  const dist = to.length();
  const legEnd = leg.length === 1;
  const last = legEnd && plan.length === 1;

  if (dist < (last ? 1.3 : legEnd ? 1.8 : 2)) {
    leg.shift();
    if (!leg.length) {
      const wp = plan.shift();
      legs.shift();
      if (wp.dock) openPanel(poiById[wp.dock]);
    }
    progress = { best: Infinity, t: timeReal };
    return { throttle: 0, turn: 0 };
  }

  // Safety net: no headway for two seconds means re-plan from right here.
  if (dist < progress.best - 0.4) progress = { best: dist, t: timeReal };
  else if (timeReal - progress.t > 2) {
    legs[0] = planPath(boat.pos, plan[0].pos);
    progress = { best: Infinity, t: timeReal };
  }

  const diff = wrapAngle(to.angle() - boat.angle);
  let want = last ? min(MAX_SPEED, dist * 1.1 + 1.2) : MAX_SPEED;
  // Ease off ahead of a sharp corner so the turn stays tight.
  const after = leg[1] ?? legs[1]?.[0];
  if (after && dist < 6) {
    const corner = abs(wrapAngle(after.subtract(target).angle() - to.angle()));
    want *= clamp(1 - corner / PI, 0.4, 1);
  }
  if (abs(diff) > 1.1) want *= 0.35;
  return { throttle: clamp(want - boat.speed, -1, 1), turn: clamp(diff * 2.6, -1, 1) };
};

const updateBoat = () => {
  const dt = timeDelta;
  const manual = keyDirection();
  let { x: turn, y: throttle } = manual;

  if (manual.x || manual.y) clearRoute();
  else if (plan.length && !drag?.moved) ({ throttle, turn } = autopilot());

  boat.speed += throttle * (throttle * boat.speed < 0 ? 10 : 5) * dt;
  if (!throttle) boat.speed *= 0.985;
  boat.speed = clamp(boat.speed, -3, MAX_SPEED);
  boat.angle = wrapAngle(boat.angle + turn * 2.3 * dt * clamp(0.4 + abs(boat.speed) / 6, 0, 1.2));

  const push = currentPush();
  inCurrent = push.lengthSquared() > 0.5;
  boat.vel = vec2().setAngle(boat.angle, boat.speed).add(push);
  let next = boat.pos.add(boat.vel.scale(dt));

  for (const p of pois) {
    if (p.hidden) continue;
    const rel = next.subtract(p.pos);
    if (rel.length() > p.hitRadius + 1) continue;
    const minD = coastRadius(p, rel.angle()) + 0.6;
    if (rel.length() < minD) {
      next = p.pos.add(rel.normalize(minD));
      if (abs(boat.speed) > 3 && bumpCooldown <= 0) {
        play("bump");
        bumpCooldown = 0.6;
      }
      boat.speed *= 0.9;
    }
  }
  next.x = clamp(next.x, WORLD.minX + 1, WORLD.maxX - 1);
  next.y = clamp(next.y, WORLD.minY + 1, WORLD.maxY - 1);
  boat.pos = next;

  // Wake foam from the stern quarters.
  if (abs(boat.speed) > 0.8 && frame % 2 === 0)
    for (const side of [-1, 1]) {
      const local = vec2(side * 0.42, -1.1).rotate(boat.angle);
      foam.push({
        pos: boat.pos.add(local),
        vel: vec2(side * 0.6, -0.4).rotate(boat.angle),
        t: timeReal,
        size: 0.25 + abs(boat.speed) * 0.03,
      });
    }
};

const updateDiscovery = () => {
  for (const p of pois)
    if (!isCharted(p.id) && boat.pos.distance(p.pos) < p.radius + (p.hidden ? 4 : 10)) chart(p);

  for (const ring of pings) {
    const r = ringRadius(ring);
    for (const p of pois)
      if (!ring.hit.has(p.id) && p.pos.distance(ring.pos) <= r) {
        ring.hit.add(p.id);
        chart(p);
      }
  }

  for (const b of buoys)
    if (!getState().skills.includes(b.name) && boat.pos.distance(b.pos) < 1.8) collect(b);

  const near = nearestDock();
  if ((near?.id ?? null) !== promptId) {
    promptId = near?.id ?? null;
    setState({ prompt: near ? { id: near.id, name: near.name, verb: near.verb } : null });
  }
  if (near && (keyWasPressed("KeyE") || keyWasPressed("Enter"))) openPanel(near);

  checkComplete();
};

const ringRadius = (ring) => {
  const t = clamp((timeReal - ring.t) / SONAR_TIME, 0, 1);
  return SONAR_RANGE * (1 - (1 - t) ** 3);
};

const updateCamera = () => {
  const base = max(Math.sqrt(mainCanvasSize.x * mainCanvasSize.y) / 34, min(mainCanvasSize.x, mainCanvasSize.y) / 22);
  const targetScale = base * (started ? zoom : 0.8);
  setCameraScale(lerp(cameraScale, targetScale, 0.12));

  const view = getCameraSize();
  const lead = started ? boat.vel.scale(0.5) : vec2(sin(timeReal * 0.1) * 6, 6);
  let target = boat.pos.add(lead);
  const half = view.scale(0.5);
  const clampAxis = (v, lo, hi, h) => (hi - lo < h * 2 ? (lo + hi) / 2 : clamp(v, lo + h, hi - h));
  target = vec2(
    clampAxis(target.x, WORLD.minX - 4, WORLD.maxX + 4, half.x),
    clampAxis(target.y, WORLD.minY - 4, WORLD.maxY + 4, half.y)
  );
  setCameraPos(cameraPos.lerp(target, started ? 0.08 : 0.03));
};

let hudFrame = 0;
const pushTelemetry = () => {
  if (hudFrame++ % 5) return;
  let routeNm = 0;
  let from = boat.pos;
  for (const point of legs.flat()) {
    routeNm += from.distance(point);
    from = point;
  }
  setState({
    telemetry: {
      heading: ((boat.angle * 180) / PI + 360) % 360,
      speed: abs(boat.speed) * 2,
      x: boat.pos.x,
      y: boat.pos.y,
      autopilot: plan.length > 0,
      routeNm: routeNm / 10,
      current: inCurrent,
    },
    sonarReady: pingCooldown <= 0,
  });
};

function gameUpdate() {
  pingCooldown -= timeDelta;
  bumpCooldown -= timeDelta;

  if (started) {
    handlePointer();
    if (keyWasPressed("Space")) ping();
    if (keyWasPressed("Escape")) clearRoute();
    if (keyWasPressed("Equal") || keyWasPressed("NumpadAdd")) commands.zoom(1);
    if (keyWasPressed("Minus") || keyWasPressed("NumpadSubtract")) commands.zoom(-1);
    updateBoat();
    updateDiscovery();
  }

  pings = pings.filter((r) => timeReal - r.t < SONAR_TIME + 0.4);
}

function gameUpdatePost() {
  updateCamera();
  pushTelemetry();
}

// --- Rendering -------------------------------------------------------------

const drawOcean = () => {
  const view = getCameraSize();
  const lo = cameraPos.subtract(view.scale(0.5));
  const hi = cameraPos.add(view.scale(0.5));

  for (const p of patches)
    if (isOnScreen(p.pos, p.size))
      drawCircleGradient(p.pos, p.size, (p.light ? C.seaLight : C.seaDark).withAlpha(0.35), CLEAR);

  // Chart graticule every 10 units, plus the chart's double frame.
  for (let x = Math.ceil(lo.x / 10) * 10; x <= hi.x; x += 10)
    drawLine(vec2(x, lo.y), vec2(x, hi.y), 0.05, C.grid);
  for (let y = Math.ceil(lo.y / 10) * 10; y <= hi.y; y += 10)
    drawLine(vec2(lo.x, y), vec2(hi.x, y), 0.05, C.grid);
  const frameCol = hex("#e9d6a6", 0.35);
  for (const inset of [0, 0.8]) {
    const a = vec2(WORLD.minX - inset, WORLD.minY - inset);
    const b = vec2(WORLD.maxX + inset, WORLD.maxY + inset);
    drawLine(a, vec2(b.x, a.y), 0.12, frameCol);
    drawLine(vec2(b.x, a.y), b, 0.12, frameCol);
    drawLine(b, vec2(a.x, b.y), 0.12, frameCol);
    drawLine(vec2(a.x, b.y), a, 0.12, frameCol);
  }

  // Little wave chevrons that breathe in and out.
  const step = 2.8;
  for (let ix = Math.floor(lo.x / step) - 1; ix <= hi.x / step + 1; ix++)
    for (let iy = Math.floor(lo.y / step) - 1; iy <= hi.y / step + 1; iy++) {
      const h1 = hash(ix, iy);
      const h2 = hash(ix, iy, 1);
      const p = vec2(ix * step + h1 * 2, iy * step + h2 * 2 + sin(timeReal * 0.6 + h1 * 6) * 0.15);
      const glow = 0.5 + 0.5 * sin(timeReal * 0.9 + hash(ix, iy, 2) * 6.28);
      const col = C.wave.withAlpha(0.03 + 0.11 * glow);
      const w = 0.35 + h1 * 0.35;
      drawLine(p.add(vec2(-w, 0)), p.add(vec2(0, 0.16)), 0.06, col);
      drawLine(p.add(vec2(0, 0.16)), p.add(vec2(w, 0)), 0.06, col);
    }
};

const drawCurrent = () => {
  const spacing = 2.4;
  for (const [lane, off] of [[-1.3, 0.3], [0, 0], [1.3, 0.6]]) {
    for (let s = ((timeReal * CURRENT.strength * 0.7 + off * spacing) % spacing); s < currentLength; s += spacing) {
      const { pos, dir } = sampleCurrent(s);
      if (!isOnScreen(pos, 2)) continue;
      const side = vec2(dir.y, -dir.x).scale(lane);
      const fade = clamp(min(s, currentLength - s) / 5, 0, 1);
      const a = pos.add(side);
      drawLine(a, a.add(dir.scale(1.1)), 0.09, C.wave.withAlpha(0.32 * fade));
    }
  }
};

const fan = (center, points, scale, color, angle = 0) => {
  // Coastlines are star-shaped around their centre, so a triangle fan is safe.
  for (let i = 0; i < points.length; i++) {
    const a = points[i].scale(scale);
    const b = points[(i + 1) % points.length].scale(scale);
    drawPoly([vec2(), a, b], color, 0, C.ink, center, angle);
  }
};

const drawIslandBase = (p, grass = true) => {
  drawCircleGradient(p.pos, p.radius * 3.6, C.shallow.withAlpha(0.32), CLEAR);
  // Surf line that pulses against the beach.
  const surf = 1.1 + sin(timeReal * 1.4 + p.pos.x) * 0.03;
  fan(p.pos, p.coast, p.radius * surf, C.shallow.withAlpha(0.45));
  fan(p.pos, p.coast, p.radius, C.sand);
  if (grass) {
    fan(p.pos, p.coast, p.radius * 0.8, C.grassDark);
    fan(p.pos.add(vec2(-0.1, 0.12)), p.coast, p.radius * 0.72, C.grass);
  }
};

const drawPalm = (pos, size, sway) => {
  drawCircle(pos.add(vec2(0.15, -0.15)), size * 1.6, C.ink.withAlpha(0.18));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * PI * 2 + sway;
    drawEllipse(pos.add(vec2().setAngle(a, size * 0.45)), vec2(size * 0.35, size), C.palm, a);
  }
  drawCircle(pos, size * 0.3, C.wood);
};

const drawJetty = (p) => {
  const dir = vec2().setAngle(p.dockAngle);
  const shore = coastRadius(p, p.dockAngle);
  drawRect(p.pos.add(dir.scale(shore + 0.1)), vec2(0.7, 2.2), C.wood, p.dockAngle);
  for (const s of [-1, 1])
    drawCircle(p.pos.add(dir.scale(shore + 1)).add(vec2(s * 0.42, 0).rotate(p.dockAngle)), 0.22, C.ink.withAlpha(0.7));
};

const drawFlag = (pos, color) => {
  drawLine(pos, pos.add(vec2(0, 1.6)), 0.08, C.ink);
  const wave = sin(timeReal * 4 + pos.x) * 0.15;
  drawPoly([vec2(0, 1.6), vec2(1.1, 1.35 + wave), vec2(0, 1.05)], color, 0, C.ink, pos);
};

const drawProject = (p, i) => {
  drawIslandBase(p);
  drawJetty(p);
  p.palms.forEach((pp, k) => drawPalm(p.pos.add(pp), 0.9, sin(timeReal * 0.8 + k) * 0.1));
  drawFlag(p.pos.add(vec2(0.2, -0.4)), FLAG_COLORS[i % FLAG_COLORS.length]);
};

const drawPort = (p) => {
  drawIslandBase(p);
  drawJetty(p);
  // A cluster of rooftops round the harbour.
  const houses = [[-2, 1.5, 0.3], [0.2, 2.4, -0.2], [2.2, 1.2, 0.1], [-1.2, -1, 0.5], [1.4, -1.4, -0.4], [-3.2, -0.4, 0.2]];
  for (const [x, y, a] of houses) {
    const pos = p.pos.add(vec2(x, y));
    drawRect(pos.add(vec2(0.12, -0.12)), vec2(1.3, 1), C.ink.withAlpha(0.2), a);
    drawRect(pos, vec2(1.3, 1), C.roof, a);
    drawLine(pos.add(vec2(-0.6, 0).rotate(a)), pos.add(vec2(0.6, 0).rotate(a)), 0.08, hex("#8f3d28"));
  }
  p.palms.slice(0, 3).forEach((pp, k) => drawPalm(p.pos.add(pp.scale(1.3)), 0.8, sin(timeReal * 0.8 + k) * 0.1));
};

const drawLighthouse = (p) => {
  drawIslandBase(p, false);
  drawJetty(p);
  const lamp = p.pos;
  const a = timeReal * 0.9 + p.index * 1.3;
  setAdditiveBlendMode(true);
  for (const off of [0, PI]) {
    const d1 = vec2().setAngle(a + off - 0.13, 16);
    const d2 = vec2().setAngle(a + off + 0.13, 16);
    drawPoly([vec2(), d1, d2], C.lamp.withAlpha(0.09), 0, C.ink, lamp);
  }
  drawCircleGradient(lamp, 5, C.lamp.withAlpha(0.5), CLEAR);
  setAdditiveBlendMode(false);
  drawCircle(lamp, 1.7, C.foam, 0.12, C.ink);
  drawCircle(lamp, 1.15, C.red);
  drawCircle(lamp, 0.65, C.lamp);
};

const drawSignal = (p) => {
  drawIslandBase(p);
  drawJetty(p);
  const t = (timeReal % 2.2) / 2.2;
  drawCircle(p.pos, 2 + t * 10, CLEAR, 0.12, hex("#ff9ec7", 0.6 * (1 - t)));
  drawCircle(p.pos, 1.3, hex("#d7dde2"), 0.1, C.ink);
  for (let i = 0; i < 3; i++)
    drawLine(p.pos, p.pos.add(vec2().setAngle((i / 3) * PI * 2, 1.3)), 0.1, C.ink);
  drawCircle(p.pos, 0.45, frame % 60 < 30 ? hex("#ff4d6d") : hex("#7a1c2c"));
};

const drawAtoll = (p) => {
  drawCircleGradient(p.pos, p.radius * 3.6, C.shallow.withAlpha(0.35), CLEAR);
  fan(p.pos, p.coast, p.radius * 1.1, C.foam.withAlpha(0.2));
  fan(p.pos, p.coast, p.radius, C.sand);
  fan(p.pos, p.coast, p.radius * 0.62, C.lagoon);
  drawJetty(p);
  // A little data platform in the lagoon.
  drawRect(p.pos, vec2(1.2), hex("#d7dde2"), 0.785);
  drawRect(p.pos, vec2(0.6), C.ink, 0.785);
  drawCircle(p.pos, 0.3, (frame + p.pos.x * 9) % 50 < 25 ? C.green : hex("#1d5c3a"));
};

const drawTreasure = (p) => {
  const glint = 0.5 + 0.5 * sin(timeReal * 3);
  drawCircleGradient(p.pos, 5, hex("#ffd166", 0.25 + 0.2 * glint), CLEAR);
  drawLine(p.pos.add(vec2(-1, -1)), p.pos.add(vec2(1, 1)), 0.35, C.red);
  drawLine(p.pos.add(vec2(-1, 1)), p.pos.add(vec2(1, -1)), 0.35, C.red);
};

const drawBuoy = (b) => {
  const bob = sin(timeReal * 2 + b.phase) * 0.06;
  const color = hex(b.color);
  const t = ((timeReal + b.phase) % 2.5) / 2.5;
  drawCircle(b.pos, 1 + t * 2.4, CLEAR, 0.06, C.foam.withAlpha(0.35 * (1 - t)));
  drawCircle(b.pos.add(vec2(0.12, -0.12)), 1.05, C.ink.withAlpha(0.3));
  drawCircle(b.pos, 0.95 + bob, color, 0.1, C.ink);
  drawCircle(b.pos, 0.42, C.foam);
  setAdditiveBlendMode(true);
  drawCircleGradient(b.pos, 2.6 + sin(timeReal * 3 + b.phase) * 0.4, color.withAlpha(0.35), CLEAR);
  setAdditiveBlendMode(false);
};

const HULL = [vec2(0, 1.35), vec2(0.42, 0.75), vec2(0.52, -0.2), vec2(0.46, -1.1), vec2(-0.46, -1.1), vec2(-0.52, -0.2), vec2(-0.42, 0.75)];
const DECK = HULL.map((v) => v.scale(0.78));

const drawBoat = () => {
  const { pos, angle } = boat;
  const roll = sin(timeReal * 1.7) * 0.03;
  drawPoly(HULL, C.ink.withAlpha(0.3), 0, C.ink, pos.add(vec2(0.18, -0.2)), angle);
  drawPoly(HULL, C.hull, 0.09, C.ink, pos, angle + roll);
  drawPoly(DECK, C.deck, 0, C.ink, pos, angle + roll);
  drawRect(pos.add(vec2(0, -0.2).rotate(angle)), vec2(0.6, 0.8), C.cabin, angle);
  drawRect(pos.add(vec2(0, 0.08).rotate(angle)), vec2(0.5, 0.18), hex("#244b63"), angle);
  // Radar dish sweeping on the cabin roof.
  const dish = pos.add(vec2(0, -0.35).rotate(angle));
  drawLine(dish, dish.add(vec2().setAngle(timeReal * 4, 0.3)), 0.07, C.ink);
  drawCircle(pos.add(vec2(-0.4, 0.3).rotate(angle)), 0.16, C.red);
  drawCircle(pos.add(vec2(0.4, 0.3).rotate(angle)), 0.16, C.green);
};

const drawRoute = () => {
  if (!plan.length) return;
  let from = boat.pos;
  for (const point of legs.flat()) {
    const seg = point.subtract(from);
    const len = seg.length();
    const dir = seg.scale(1 / (len || 1));
    for (let s = (timeReal * 2) % 1.2; s < len - 0.3; s += 1.2)
      drawLine(from.add(dir.scale(s)), from.add(dir.scale(min(s + 0.6, len))), 0.12, C.route.withAlpha(0.8));
    from = point;
  }
  const pulse = 0.6 + 0.4 * sin(timeReal * 4);
  plan.forEach((wp, i) => {
    const held = drag?.index === i;
    const size = held ? 2 : 1.5;
    drawCircle(wp.pos, size + (i === plan.length - 1 ? pulse * 0.4 : 0), CLEAR, 0.1, C.route);
    drawCircle(wp.pos, size * 0.62, held ? C.route : C.ink.withAlpha(0.75), 0.08, C.route);
  });
};

const drawEffects = () => {
  for (const f of foam) {
    const age = timeReal - f.t;
    const pos = f.pos.add(f.vel.scale(age));
    drawCircle(pos, f.size + age * 0.5, C.foam.withAlpha(0.35 * (1 - age / 1.6)));
  }
  foam = foam.filter((f) => timeReal - f.t < 1.6);

  setAdditiveBlendMode(true);
  for (const ring of pings) {
    const age = timeReal - ring.t;
    const r = ringRadius(ring);
    const a = clamp(1 - age / (SONAR_TIME + 0.4), 0, 1);
    drawCircle(ring.pos, r * 2, CLEAR, 0.25, C.sonar.withAlpha(0.7 * a));
    drawCircle(ring.pos, r * 1.8, CLEAR, 0.12, C.sonar.withAlpha(0.3 * a));
    drawCircleGradient(ring.pos, r * 2, CLEAR, C.sonar.withAlpha(0.06 * a));
  }
  for (const b of blips) {
    const age = timeReal - b.t;
    const a = clamp(1 - age / 2.5, 0, 1);
    drawCircle(b.pos, b.size + age * 6, CLEAR, 0.18, C.sonar.withAlpha(a));
    drawCircleGradient(b.pos, b.size * 1.5, C.sonar.withAlpha(0.3 * a), CLEAR);
  }
  blips = blips.filter((b) => timeReal - b.t < 2.5);

  for (const s of sparks) {
    const age = timeReal - s.t;
    drawCircle(s.pos.add(s.vel.scale(age * (1 - age / 2))), 0.35 * (1 - age / 0.8), s.color);
  }
  sparks = sparks.filter((s) => timeReal - s.t < 0.8);
  setAdditiveBlendMode(false);
};

function gameRender() {
  drawOcean();
  drawCurrent();
  for (const r of rocks) drawRegularPoly(r.pos, vec2(r.size), 5, hex("#3c4a52"), 0.08, C.ink, r.angle);
  drawRoute();

  let projectIndex = 0;
  for (const p of pois) {
    if (!isOnScreen(p.pos, p.radius * 4 + 16)) {
      if (p.kind === "project") projectIndex++;
      continue;
    }
    if (p.kind === "project") drawProject(p, projectIndex++);
    else if (p.kind === "port") drawPort(p);
    else if (p.kind === "lighthouse") drawLighthouse(p);
    else if (p.kind === "signal") drawSignal(p);
    else if (p.kind === "api") drawAtoll(p);
    else if (p.kind === "treasure" && isCharted(p.id)) drawTreasure(p);
  }

  const collected = getState().skills;
  for (const b of buoys) if (!collected.includes(b.name) && isOnScreen(b.pos, 4)) drawBuoy(b);

  drawEffects();
  drawBoat();
  drawGuideRing();
}

// The onboarding's gold marker: a ring on the target, or an arrow at the
// screen edge pointing towards it when it's out of view.
const guidePos = () => {
  const g = getState().guide;
  return g && started ? vec2(g.x, g.y) : null;
};

const drawGuideRing = () => {
  const pos = guidePos();
  if (!pos) return;
  const t = (timeReal % 1.4) / 1.4;
  drawCircle(pos, 3 + t * 3, CLEAR, 0.18, C.route.withAlpha(1 - t));
  drawCircle(pos, 3, CLEAR, 0.12, C.route.withAlpha(0.8));
};

const drawGuideArrow = () => {
  const pos = guidePos();
  if (!pos) return;
  const dpr = DPR();
  const s = worldToScreen(pos);
  const small = mainCanvasSize.x < 760 * dpr;
  const inset = { l: 40 * dpr, r: 40 * dpr, t: 90 * dpr, b: (small ? 220 : 130) * dpr };
  // Anything visible on screen already wears the gold ring.
  const edge = 24 * dpr;
  if (s.x > edge && s.x < mainCanvasSize.x - edge && s.y > edge && s.y < mainCanvasSize.y - edge) return;

  // Walk from the screen centre towards the target until we hit the inset box.
  const c = mainCanvasSize.scale(0.5);
  const d = s.subtract(c);
  const k = min(
    abs(d.x) > 0 ? ((d.x > 0 ? mainCanvasSize.x - inset.r : inset.l) - c.x) / d.x : Infinity,
    abs(d.y) > 0 ? ((d.y > 0 ? mainCanvasSize.y - inset.b : inset.t) - c.y) / d.y : Infinity
  );
  const at = screenToWorld(c.add(d.scale(k)));
  const dir = pos.subtract(at);
  const unit = (16 * dpr) / cameraScale;
  const bob = sin(timeReal * 6) * unit * 0.25;
  const tip = [vec2(0, 1.3), vec2(1, -0.7), vec2(0, -0.25), vec2(-1, -0.7)].map((v) => v.scale(unit).add(vec2(0, bob)));
  drawPoly(tip, C.route, unit * 0.12, C.ink, at, dir.angle());
  drawText(`${(boat.pos.distance(pos) / 10).toFixed(1)} nm`, at.subtract(dir.normalize(unit * 2.4)), unit * 0.75, C.route, unit * 0.15, C.ink, "center", MONO_FONT, "600");
};

const REGION_LABELS = [
  ["Project Archipelago", vec2(40, 31), 0],
  ["API Atolls", vec2(-22, 49), 0],
  ["The Career Current", vec2(-52, 2), -PI / 2],
  ["Wreck Shoals", vec2(-54, -48), 0],
];

function gameRenderPost() {
  drawGuideArrow();
  plan.forEach((wp, i) => {
    const held = drag?.index === i;
    drawText(wp.dock ? "⚓" : i + 1, wp.pos.add(vec2(0, -0.04)), 0.62, held ? C.ink : C.route, 0, C.ink, "center", MONO_FONT, "700");
  });
  const outline = C.ink.withAlpha(0.85);
  for (const [text, pos, angle] of REGION_LABELS)
    if (isOnScreen(pos, 20))
      drawText(text.toUpperCase(), pos, 1.5, C.label.withAlpha(0.2), 0, outline, "center", LABEL_FONT, "italic 600", undefined, angle);

  for (const p of pois) {
    if (!isCharted(p.id) || !isOnScreen(p.pos, p.radius * 2 + 8)) continue;
    const below = p.pos.add(vec2(0, -p.radius - 1.5));
    const visited = getState().visited.includes(p.id);
    const title = p.kind === "lighthouse" ? p.job.title : p.name;
    drawText(title, below, 0.95, C.label, 0.22, outline, "center", LABEL_FONT, "italic 600");
    const sub = p.kind === "lighthouse" ? p.name : p.region;
    drawText(`${visited ? "✓ " : ""}${sub}`.toUpperCase(), below.add(vec2(0, -1)), 0.55, visited ? C.green : C.sonar.withAlpha(0.8), 0.15, outline, "center", MONO_FONT);
  }

  const collected = getState().skills;
  for (const b of buoys) {
    if (collected.includes(b.name) || boat.pos.distance(b.pos) > 12 || !isOnScreen(b.pos, 4)) continue;
    drawText(b.name, b.pos.add(vec2(0, 1.4)), 0.6, C.label, 0.15, outline, "center", MONO_FONT);
  }

  for (const f of floaters) {
    const age = timeReal - f.t;
    drawText(f.text, f.pos.add(vec2(0, 1.5 + age * 1.6)), 0.85, f.color.withAlpha(1 - age / 1.4), 0.2, outline, "center", MONO_FONT, "600");
  }
  floaters = floaters.filter((f) => timeReal - f.t < 1.4);

  // Lat/lon ticks along the bottom and left edges of the screen.
  const view = getCameraSize();
  const lo = cameraPos.subtract(view.scale(0.5));
  const hi = cameraPos.add(view.scale(0.5));
  const px = 11 * DPR();
  const tick = C.label.withAlpha(0.35);
  for (let x = Math.ceil(lo.x / 10) * 10; x <= hi.x; x += 10) {
    const s = worldToScreen(vec2(x, lo.y));
    const lon = 73.6 + x * 0.01;
    drawTextScreen(`${lon.toFixed(1)}°E`, vec2(s.x + 4 * DPR(), s.y - 8 * DPR()), px, tick, 0, C.ink, "left", MONO_FONT);
  }
  for (let y = Math.ceil(lo.y / 10) * 10; y <= hi.y; y += 10) {
    const s = worldToScreen(vec2(lo.x, y));
    const lat = 12.9 + y * 0.01;
    drawTextScreen(`${lat.toFixed(1)}°N`, vec2(s.x + 6 * DPR(), s.y - 6 * DPR()), px, tick, 0, C.ink, "left", MONO_FONT);
  }
}

// --- Boot ------------------------------------------------------------------

let booted = false;

export function startGame(root) {
  if (booted) return;
  booted = true;
  seaRoot = root;

  setShowSplashScreen(false);
  setDebugWatermark(false);
  // Dev builds only: Esc clears the route, so park the engine's debug overlay on F9.
  setDebugKey("F9");
  setInputPreventDefault(false);
  setTouchGamepadEnable(false);
  setCanvasClearColor(C.sea);
  setCanvasPixelRatio(PIXEL_RATIO);
  setCanvasMaxSize(vec2(5120, 5120));
  setFontDefault(LABEL_FONT);

  // Only presses that land on the sea itself steer the boat; taps on the
  // HUD and panels belong to React.
  window.addEventListener("pointerdown", (e) => (pressOnSea = root.contains(e.target)), true);
  window.addEventListener("keydown", (e) => {
    const onSea = e.target === document.body || root.contains(e.target);
    if (onSea && ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
  });
  window.addEventListener(
    "wheel",
    (e) => {
      if (started && root.contains(e.target)) commands.zoom(e.deltaY < 0 ? 1 : -1, 0.08);
    },
    { passive: true }
  );

  Object.assign(commands, {
    start() {
      started = true;
      setState({ started: true });
      // The voyage begins at home: chart the port straight away.
      chart(poiById.port);
    },
    ping,
    dock() {
      const near = nearestDock();
      if (near) openPanel(near);
    },
    setCourse(id) {
      const p = poiById[id];
      if (p) setCourseTo(p);
    },
    clearRoute,
    closePanel() {
      setState({ panel: null });
      inputClear();
      setPaused(false);
    },
    pause(value) {
      inputClear();
      setPaused(value);
    },
    setMuted(value) {
      setMutedAudio(value);
      setState({ muted: value });
    },
    zoom(dir, amount = 0.15) {
      zoom = clamp(zoom * (1 + dir * amount), 0.55, 1.8);
    },
  });

  // Dev-only handle for poking at the route in the browser console.
  if (import.meta.env.DEV)
    window.__sonar = {
      plan: () => plan.map((w) => w.pos),
      toScreen: (pos) => worldToScreen(pos).scale(1 / DPR()),
      boat: () => boat,
    };

  setCameraPos(boat.pos.add(vec2(0, 6)));
  flushQueuedCommands();
  engineInit(() => {}, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [], root);
}
