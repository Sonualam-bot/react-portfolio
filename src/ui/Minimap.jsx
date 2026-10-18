import { commands } from "../game/bridge";
import { WORLD, pois, buoys, currentPath } from "../game/world";
import { useGame } from "./useGame";

const W = WORLD.maxX - WORLD.minX;
const H = WORLD.maxY - WORLD.minY;
// SVG y runs down, the chart's runs up.
const sx = (x) => x - WORLD.minX;
const sy = (y) => WORLD.maxY - y;

const KIND_COLOR = {
  port: "#f4ecd6",
  project: "#ffd166",
  api: "#47d1c6",
  lighthouse: "#ff8a6b",
  signal: "#ff9ec7",
  treasure: "#ffd166",
};

function Minimap() {
  const { telemetry, charted, visited, skills } = useGame();

  return (
    <svg className="minimap" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Chart of the archipelago">
      <rect width={W} height={H} className="minimap-sea" />
      {[...Array(Math.floor(W / 20))].map((_, i) => (
        <line key={`v${i}`} x1={(i + 1) * 20} x2={(i + 1) * 20} y1={0} y2={H} className="minimap-grid" />
      ))}
      {[...Array(Math.floor(H / 20))].map((_, i) => (
        <line key={`h${i}`} y1={(i + 1) * 20} y2={(i + 1) * 20} x1={0} x2={W} className="minimap-grid" />
      ))}
      <polyline
        points={currentPath.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")}
        className="minimap-current"
      />

      {buoys
        .filter((b) => !skills.includes(b.name))
        .map((b) => (
          <circle key={b.name} cx={sx(b.pos.x)} cy={sy(b.pos.y)} r={0.9} className="minimap-buoy" />
        ))}

      {pois
        .filter((p) => charted.includes(p.id))
        .map((p) => (
          <g key={p.id}>
            <circle
              cx={sx(p.pos.x)}
              cy={sy(p.pos.y)}
              r={p.kind === "treasure" ? 2.2 : Math.max(p.radius, 2.4)}
              fill={KIND_COLOR[p.kind]}
              opacity={visited.includes(p.id) ? 1 : 0.55}
            />
            <circle
              cx={sx(p.pos.x)}
              cy={sy(p.pos.y)}
              r={Math.max(p.radius, 2.4) + 3}
              className="minimap-hit"
              role="button"
              tabIndex={-1}
              aria-label={`Set course to ${p.name}`}
              onClick={() => commands.setCourse(p.id)}
            >
              <title>{p.kind === "lighthouse" ? `${p.name} · ${p.job.title}` : p.name}</title>
            </circle>
          </g>
        ))}

      <g transform={`translate(${sx(telemetry.x)} ${sy(telemetry.y)}) rotate(${telemetry.heading})`}>
        <circle r={5} className="minimap-boat-halo" />
        <path d="M0 -3.4 L2.2 2.6 L0 1.4 L-2.2 2.6 Z" className="minimap-boat" />
      </g>
    </svg>
  );
}

export default Minimap;
