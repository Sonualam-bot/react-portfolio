import { PI, RandomGenerator, vec2 } from "littlejsengine";
import { FrontEndProjects, BackendApi } from "../data/projects";
import { workDetails } from "../data/work";
import { allSkills } from "../data/skills";

// World units are roughly "cables" on the chart; y points north.
export const WORLD = { minX: -66, maxX: 66, minY: -52, maxY: 52 };
export const START = { pos: vec2(0, -25), angle: 0 };

// Points of interest. `dockAngle` is the compass bearing (clockwise from
// north) from the island's centre to its jetty.
const poi = (id, kind, name, x, y, radius, dockAngle, extra = {}) => ({
  id,
  kind,
  name,
  pos: vec2(x, y),
  radius,
  dockAngle,
  ...extra,
});

const projectSpots = [
  [22, -18, 5, -PI / 2],
  [38, -5, 4.4, -PI * 0.75],
  [23, 5, 4, -PI / 2],
  [52, 8, 5, PI],
  [38, 21, 4.4, -PI * 0.6],
  [56, -24, 4.2, -PI * 0.25],
];

const atollSpots = [
  [-12, 40, 0.55 * PI],
  [0, 46, 0.6 * PI],
  [12, 38, PI],
  [25, 45, -0.6 * PI],
  [-1, 31, -0.75 * PI],
];

// Oldest first, so the career current flows from college towards today.
const career = [...workDetails].reverse();
const lighthouseSpots = [
  [-20, -25, PI * 0.6],
  [-34, -10, PI * 0.55],
  [-41, 8, PI * 0.5],
  [-34, 26, PI * 0.45],
];

export const pois = [
  poi("port", "port", "Port Alam", 0, -35, 6.5, 0, {
    region: "Home port",
    verb: "Dock at",
  }),
  poi("signal", "signal", "Signal Station", 18, -40, 3.4, -PI * 0.3, {
    region: "Contact",
    verb: "Radio from",
  }),
  ...FrontEndProjects.slice(0, projectSpots.length).map((project, i) => {
    const [x, y, r, dock] = projectSpots[i];
    return poi(`project-${project.id}`, "project", project.title.trim(), x, y, r, dock, {
      region: "Project island",
      verb: "Explore",
      project,
    });
  }),
  ...BackendApi.slice(0, atollSpots.length).map((project, i) => {
    const [x, y, dock] = atollSpots[i];
    return poi(`api-${project.id}`, "api", project.title.trim(), x, y, 3, dock, {
      region: "API atoll",
      verb: "Inspect",
      project,
    });
  }),
  ...career.map((job, i) => {
    const [x, y, dock] = lighthouseSpots[i];
    return poi(`light-${i}`, "lighthouse", job.year, x, y, 2.3, dock, {
      region: "Lighthouse",
      verb: "Climb",
      job,
      index: i,
    });
  }),
  poi("treasure", "treasure", "Sunken chest", -54, -38, 1.2, 0, {
    region: "Wreck",
    verb: "Dive for",
    hidden: true,
  }),
];

export const poiById = Object.fromEntries(pois.map((p) => [p.id, p]));

// Distance from an island's centre to its drawn shoreline along a bearing.
export const coastRadius = (p, angle) => {
  const n = p.coast.length;
  const f = ((((angle / (PI * 2)) % 1) + 1) % 1) * n;
  const i = Math.floor(f) % n;
  const a = p.coast[i].length();
  const b = p.coast[(i + 1) % n].length();
  return p.radius * (a + (b - a) * (f - Math.floor(f)));
};

export const dockPoint = (p, extra = 0) =>
  p.pos.add(vec2().setAngle(p.dockAngle, (p.coast ? coastRadius(p, p.dockAngle) : p.radius) + 0.9 + extra));

// Coastlines: a wobbly loop per island, seeded by its position.
const coastline = (p, sides = 40) => {
  const rng = new RandomGenerator((p.pos.x * 73 + p.pos.y * 191 + 9973) | 0);
  const waves = [1, 2, 3].map((k) => [rng.float(0.05, 0.13) / k, rng.angle(), k + 1]);
  const points = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * PI * 2;
    let r = 1;
    for (const [amp, phase, freq] of waves) r += amp * Math.sin(a * freq + phase);
    points.push(vec2().setAngle(a, r));
  }
  return points;
};

for (const p of pois) {
  p.coast = coastline(p);
  // Clicks anywhere on the drawn island count, not just inside its nominal radius.
  p.hitRadius = p.radius * Math.max(...p.coast.map((v) => v.length())) + 1;
  // Palms and huts sit at seeded spots inside the grass.
  const rng = new RandomGenerator((p.pos.x * 31 + p.pos.y * 17 + 101) | 0);
  p.palms = Array.from({ length: Math.round(p.radius * 0.9) }, () =>
    vec2().setAngle(rng.angle(), rng.float(0.15, 0.55) * p.radius)
  );
}

// The career current runs past the lighthouses and pushes boats along.
export const currentPath = [
  vec2(-7, -28),
  vec2(-15, -24),
  vec2(-28, -12),
  vec2(-35, 6),
  vec2(-29, 25),
  vec2(-18, 35),
];
export const CURRENT = { width: 3.2, strength: 3.2 };

// Skill buoys: the first few sit by the start so the mechanic explains itself.
const buoySpots = [vec2(0, -19), vec2(-4.5, -15), vec2(4.5, -14.5)];

const placeBuoys = () => {
  const rng = new RandomGenerator(2025);
  const spots = [...buoySpots];
  const clear = (v) =>
    pois.every((p) => v.distance(p.pos) > p.radius + 4) &&
    spots.every((s) => v.distance(s) > 7) &&
    v.distance(START.pos) > 4;
  let guard = 0;
  while (spots.length < allSkills.length && guard++ < 5000) {
    const v = vec2(rng.float(WORLD.minX + 6, WORLD.maxX - 6), rng.float(WORLD.minY + 6, WORLD.maxY - 6));
    if (clear(v)) spots.push(v);
  }
  return allSkills.map((skill, i) => ({ ...skill, pos: spots[i], phase: i * 1.7 }));
};

export const buoys = placeBuoys();

// A position on the chart, shown as latitude/longitude in the HUD.
// The sea is pinned off the Karnataka coast, west of Bengaluru.
export const toLatLon = (pos) => ({
  lat: 12.9 + pos.y * 0.01,
  lon: 73.6 + pos.x * 0.01,
});
