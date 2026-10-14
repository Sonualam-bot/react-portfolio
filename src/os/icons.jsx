import { useId } from "react";

// Original glossy icons in the spirit of early-2000s desktops.
// Gradient ids come from useId so copies inside hidden windows never break
// the ones that are visible.
function useIds(...names) {
  const base = useId().replace(/:/g, "");
  return Object.fromEntries(names.map((n) => [n, `${base}-${n}`]));
}

function Svg({ size = 32, children, title, ...rest }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export function FolderIcon(props) {
  const id = useIds("back", "front");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.back} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7d36b" />
          <stop offset="1" stopColor="#d9a520" />
        </linearGradient>
        <linearGradient id={id.front} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1b3" />
          <stop offset=".45" stopColor="#ffd75e" />
          <stop offset="1" stopColor="#efb526" />
        </linearGradient>
      </defs>
      <path d="M4 11a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill={`url(#${id.back})`} stroke="#b7860f" />
      <path d="M3 19.5A2.5 2.5 0 0 1 5.5 17h37a2.5 2.5 0 0 1 2.5 2.7L43.6 39a3 3 0 0 1-3 3H7.4a3 3 0 0 1-3-3z" fill={`url(#${id.front})`} stroke="#c8961a" />
      <path d="M6 19h36" stroke="#fff" strokeOpacity=".8" />
    </Svg>
  );
}

export function ProfileIcon(props) {
  const id = useIds("card", "person");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.card} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d7e4f7" />
        </linearGradient>
        <linearGradient id={id.person} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fb0ff" />
          <stop offset="1" stopColor="#1d5fd1" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="40" height="32" rx="4" fill={`url(#${id.card})`} stroke="#5c7fb8" />
      <rect x="4" y="8" width="40" height="7" rx="4" fill="#3d7be0" />
      <rect x="4" y="12" width="40" height="3" fill="#3d7be0" />
      <circle cx="17" cy="24" r="5" fill={`url(#${id.person})`} />
      <path d="M8.5 36c.8-5 4.3-7.5 8.5-7.5s7.7 2.5 8.5 7.5z" fill={`url(#${id.person})`} />
      <path d="M29 22h11M29 27h11M29 32h7" stroke="#8aa3c9" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function NotepadIcon(props) {
  const id = useIds("page");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.page} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3e9f2" />
        </linearGradient>
      </defs>
      <path d="M10 5h21l9 9v29H10z" fill={`url(#${id.page})`} stroke="#7d8ea8" />
      <path d="M31 5v9h9" fill="#cdd7e6" stroke="#7d8ea8" />
      <rect x="10" y="5" width="21" height="5" fill="#4a86e8" />
      <path d="M15 19h20M15 24h20M15 29h20M15 34h14" stroke="#6b84ad" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function DiscIcon(props) {
  const id = useIds("disc", "sheen");
  return (
    <Svg {...props}>
      <defs>
        <radialGradient id={id.disc} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#c9d3e0" />
          <stop offset="1" stopColor="#8d9bb0" />
        </radialGradient>
        <linearGradient id={id.sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9ad5" stopOpacity=".7" />
          <stop offset=".35" stopColor="#8fd3ff" stopOpacity=".7" />
          <stop offset=".65" stopColor="#b6ff9a" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffe48a" stopOpacity=".7" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="19" fill={`url(#${id.disc})`} stroke="#6c7a90" />
      <circle cx="24" cy="24" r="19" fill={`url(#${id.sheen})`} />
      <circle cx="24" cy="24" r="6.5" fill="#eef2f7" stroke="#8d9bb0" />
      <circle cx="24" cy="24" r="2.5" fill="#fff" stroke="#6c7a90" />
    </Svg>
  );
}

export function MailIcon(props) {
  const id = useIds("body");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe6ef" />
        </linearGradient>
      </defs>
      <rect x="4" y="11" width="40" height="27" rx="3" fill={`url(#${id.body})`} stroke="#6f84a6" />
      <path d="M5 13l19 14 19-14" fill="none" stroke="#6f84a6" strokeWidth="1.5" />
      <path d="M5 37l14-12M43 37 29 25" stroke="#9aaccb" strokeWidth="1.5" />
      <rect x="33" y="14" width="7" height="8" fill="#e8562c" stroke="#a7330f" strokeWidth=".8" />
    </Svg>
  );
}

export function ResumeIcon(props) {
  const id = useIds("page");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.page} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e7e7ea" />
        </linearGradient>
      </defs>
      <path d="M10 5h21l9 9v29H10z" fill={`url(#${id.page})`} stroke="#8b8b96" />
      <path d="M31 5v9h9" fill="#d6d6dc" stroke="#8b8b96" />
      <path d="M15 22h20M15 27h20M15 32h13" stroke="#a0a0ab" strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="9" width="17" height="9" rx="1.5" fill="#d0311f" />
      <text x="14.5" y="16.3" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Tahoma, Verdana, sans-serif">CV</text>
    </Svg>
  );
}

export function RecycleBinIcon(props) {
  const id = useIds("bin");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.bin} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9d6e6" />
          <stop offset=".45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a9bad1" />
        </linearGradient>
      </defs>
      <path d="M10 12h28l-3 31H13z" fill={`url(#${id.bin})`} stroke="#61738f" />
      <ellipse cx="24" cy="12" rx="14" ry="3.5" fill="#e9eff7" stroke="#61738f" />
      <path d="M18 17l1.5 22M24 17v22M30 17l-1.5 22" stroke="#8ea0bb" />
      <path d="M20.5 30.5l2.5-4 2.5 4M28 31.5h-5" fill="none" stroke="#2e9a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GlobeIcon(props) {
  const id = useIds("sea");
  return (
    <Svg {...props}>
      <defs>
        <radialGradient id={id.sea} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#bfe3ff" />
          <stop offset=".5" stopColor="#3d8fe8" />
          <stop offset="1" stopColor="#164fb0" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill={`url(#${id.sea})`} stroke="#123f8f" />
      <path d="M14 13c4 1 5 4 3 6s-6 1-6 5 4 4 5 8l-2 4c-4-3-7-8-7-13 0-4 3-8 7-10zM27 9c3 1 7 3 9 7l-4 1c-2 2 1 4-1 6s-5 0-6-3 1-4 0-6-1-4 2-5zM33 29c2 0 4 1 4 3-2 3-4 5-7 6 0-3 1-8 3-9z" fill="#5bc35a" stroke="#2e8a34" strokeWidth=".8" />
      <ellipse cx="18" cy="15" rx="7" ry="3.5" fill="#fff" opacity=".35" />
    </Svg>
  );
}

export function PictureIcon(props) {
  const id = useIds("sky");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5aa7ff" />
          <stop offset="1" stopColor="#cfe8ff" />
        </linearGradient>
      </defs>
      <rect x="5" y="9" width="38" height="30" rx="2" fill="#fff" stroke="#6f84a6" />
      <rect x="8" y="12" width="32" height="24" fill={`url(#${id.sky})`} />
      <path d="M8 36l9-11 6 7 5-5 12 9z" fill="#4caf3e" />
      <circle cx="32" cy="18" r="3" fill="#ffe46b" />
    </Svg>
  );
}

export function InfoIcon(props) {
  const id = useIds("orb");
  return (
    <Svg {...props}>
      <defs>
        <radialGradient id={id.orb} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#9fd0ff" />
          <stop offset="1" stopColor="#1d5fd1" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="19" fill={`url(#${id.orb})`} stroke="#123f8f" />
      <circle cx="24" cy="14.5" r="3" fill="#fff" />
      <rect x="21" y="20" width="6" height="16" rx="2" fill="#fff" />
    </Svg>
  );
}

export function WarningIcon(props) {
  return (
    <Svg {...props}>
      <path d="M24 5 45 41H3z" fill="#ffd23f" stroke="#a87b00" strokeLinejoin="round" />
      <rect x="21.5" y="16" width="5" height="14" rx="2" fill="#222" />
      <circle cx="24" cy="35" r="2.8" fill="#222" />
    </Svg>
  );
}

export function PowerIcon(props) {
  const id = useIds("orb");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.orb} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a5c" />
          <stop offset="1" stopColor="#c62d0b" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="38" height="38" rx="8" fill={`url(#${id.orb})`} stroke="#fff" strokeWidth="2" />
      <path d="M17 16a11 11 0 1 0 14 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 11v12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

export function LogOffIcon(props) {
  const id = useIds("orb");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.orb} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd86b" />
          <stop offset="1" stopColor="#d98b00" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="38" height="38" rx="8" fill={`url(#${id.orb})`} stroke="#fff" strokeWidth="2" />
      <path d="M21 14h-6v20h6" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 24h12m-5-6 6 6-6 6" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function RestartIcon(props) {
  const id = useIds("orb");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.orb} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fe07a" />
          <stop offset="1" stopColor="#24901f" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="38" height="38" rx="8" fill={`url(#${id.orb})`} stroke="#fff" strokeWidth="2" />
      <path d="M33 20a10 10 0 1 0 1 8" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M34 11v9h-9" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function StandByIcon(props) {
  const id = useIds("orb");
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id.orb} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd86b" />
          <stop offset="1" stopColor="#d98b00" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="38" height="38" rx="8" fill={`url(#${id.orb})`} stroke="#fff" strokeWidth="2" />
      <path d="M29 13a12 12 0 1 0 6 18 10 10 0 0 1-6-18z" fill="#fff" />
    </Svg>
  );
}

export function SendIcon(props) {
  return (
    <Svg {...props}>
      <MailIcon size={48} x="0" y="4" width="40" height="40" />
      <path d="M30 6h12v12" fill="none" stroke="#2e9a3a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 6 28 20" stroke="#2e9a3a" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

/** The OS mark: an "S" drawn as a route between two waypoints. */
export function LogoMark({ size = 20, color = "#fff" }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <path
        d="M40.66 19.25A10 8.5 0 1 0 32 32A10 8.5 0 1 1 23.34 44.75"
        fill="none"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <circle cx="40.66" cy="19.25" r="5.5" fill={color} />
      <circle cx="23.34" cy="44.75" r="5.5" fill={color} />
    </svg>
  );
}

export const iconFor = {
  profile: ProfileIcon,
  folder: FolderIcon,
  notepad: NotepadIcon,
  disc: DiscIcon,
  mail: MailIcon,
  resume: ResumeIcon,
  recycle: RecycleBinIcon,
  globe: GlobeIcon,
  picture: PictureIcon,
  info: InfoIcon,
  warning: WarningIcon,
};
