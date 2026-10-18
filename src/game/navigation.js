import { vec2 } from "littlejsengine";
import { WORLD, pois, coastRadius } from "./world";

// Route planning for the autopilot: A* over a grid of open water, then
// string-pulled so the boat sails a few clean legs instead of a staircase.

const CELL = 1;
const GRID_MARGIN = 1.6; // keep the planned line this far off any beach
const SIGHT_MARGIN = 1.4; // looser, for straight-line shortcuts between cells
const cols = Math.ceil((WORLD.maxX - WORLD.minX) / CELL) + 1;
const rows = Math.ceil((WORLD.maxY - WORLD.minY) / CELL) + 1;
const obstacles = pois.filter((p) => !p.hidden);

export const isBlocked = (pos, margin = 0) => {
  if (pos.x < WORLD.minX + 1 || pos.x > WORLD.maxX - 1 || pos.y < WORLD.minY + 1 || pos.y > WORLD.maxY - 1) return true;
  for (const p of obstacles) {
    const rel = pos.subtract(p.pos);
    const d = rel.length();
    if (d < p.radius * 1.6 + margin && d < coastRadius(p, rel.angle()) + margin) return true;
  }
  return false;
};

const cellPos = (i) => vec2(WORLD.minX + (i % cols) * CELL, WORLD.minY + Math.floor(i / cols) * CELL);
const cellOf = (pos) =>
  Math.round((pos.y - WORLD.minY) / CELL) * cols + Math.round((pos.x - WORLD.minX) / CELL);

// The islands never move, so both grids are built once.
const blocked = new Uint8Array(cols * rows);
const unsighted = new Uint8Array(cols * rows);
for (let i = 0; i < blocked.length; i++) {
  blocked[i] = isBlocked(cellPos(i), GRID_MARGIN) ? 1 : 0;
  unsighted[i] = blocked[i] && isBlocked(cellPos(i), SIGHT_MARGIN) ? 1 : 0;
}

const nearestFree = (pos) => {
  const start = cellOf(pos);
  if (!blocked[start]) return start;
  for (let r = 1; r < 30; r++) {
    let best = -1;
    let bestD = Infinity;
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = (start % cols) + dx;
        const y = Math.floor(start / cols) + dy;
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const i = y * cols + x;
        const d = cellPos(i).distanceSquared(pos);
        if (!blocked[i] && d < bestD) [best, bestD] = [i, d];
      }
    if (best >= 0) return best;
  }
  return start;
};

// Waypoints dropped on (or hugging) land slide out to the nearest open water.
export const nearestWater = (pos) => (isBlocked(pos, 0.8) ? cellPos(nearestFree(pos)) : pos);

const lineClear = (a, b) => {
  const steps = Math.ceil(a.distance(b) / 0.4);
  for (let i = 1; i < steps; i++) if (unsighted[cellOf(a.lerp(b, i / steps))]) return false;
  return true;
};

// Minimal binary heap keyed by f-score.
const heapPush = (heap, f, node) => {
  heap.push([f, node]);
  let i = heap.length - 1;
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (heap[parent][0] <= heap[i][0]) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
  }
};
const heapPop = (heap) => {
  const top = heap[0];
  const last = heap.pop();
  if (heap.length) {
    heap[0] = last;
    let i = 0;
    for (;;) {
      const l = i * 2 + 1;
      const r = l + 1;
      let m = i;
      if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
      if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
      if (m === i) break;
      [heap[m], heap[i]] = [heap[i], heap[m]];
      i = m;
    }
  }
  return top[1];
};

const NEIGHBOURS = [
  [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
  [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2],
];

const astar = (start, goal) => {
  const g = new Float32Array(cols * rows).fill(Infinity);
  const came = new Int32Array(cols * rows).fill(-1);
  const gx = goal % cols;
  const gy = Math.floor(goal / cols);
  const h = (i) => {
    const dx = Math.abs((i % cols) - gx);
    const dy = Math.abs(Math.floor(i / cols) - gy);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  };
  const heap = [];
  g[start] = 0;
  heapPush(heap, h(start), start);
  while (heap.length) {
    const cur = heapPop(heap);
    if (cur === goal) break;
    const cx = cur % cols;
    const cy = Math.floor(cur / cols);
    for (const [dx, dy, cost] of NEIGHBOURS) {
      const x = cx + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
      const n = y * cols + x;
      // No cutting diagonally between two blocked cells.
      if (blocked[n] || (dx && dy && (blocked[cy * cols + x] || blocked[y * cols + cx]))) continue;
      const score = g[cur] + cost;
      if (score < g[n]) {
        g[n] = score;
        came[n] = cur;
        heapPush(heap, score + h(n), n);
      }
    }
  }
  if (came[goal] < 0 && goal !== start) return null;
  const cells = [];
  for (let i = goal; i !== -1; i = came[i]) cells.push(i);
  return cells.reverse().map(cellPos);
};

// Points to sail through from `from` to `to`, ending exactly at `to` when
// it's open water (otherwise at the nearest open water to it).
export const planPath = (from, to) => {
  const end = isBlocked(to, 0.6) ? cellPos(nearestFree(to)) : to;
  if (lineClear(from, end)) return [end];

  const cells = astar(nearestFree(from), nearestFree(end));
  if (!cells) return [end];
  const points = [...cells.slice(1), end];

  // String-pull: from each anchor, jump to the farthest point still in sight.
  const out = [];
  let anchor = from;
  let i = 0;
  while (i < points.length) {
    let j = points.length - 1;
    while (j > i && !lineClear(anchor, points[j])) j--;
    out.push(points[j]);
    anchor = points[j];
    i = j + 1;
  }
  return out;
};
