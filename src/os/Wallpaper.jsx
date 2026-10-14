// An original "green hills, blue sky" wallpaper, drawn entirely in SVG.
function Wallpaper() {
  return (
    <svg
      className="os-wallpaper"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f5fd0" />
          <stop offset=".45" stopColor="#5a9cec" />
          <stop offset=".72" stopColor="#a9d2f7" />
          <stop offset="1" stopColor="#e3f1fc" />
        </linearGradient>
        <linearGradient id="wp-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc456" />
          <stop offset="1" stopColor="#3f8f2a" />
        </linearGradient>
        <linearGradient id="wp-hill-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd65a" />
          <stop offset=".35" stopColor="#5fb33a" />
          <stop offset="1" stopColor="#2c7a1d" />
        </linearGradient>
        <radialGradient id="wp-light" cx=".3" cy=".55" r=".5">
          <stop offset="0" stopColor="#d8ff9c" stopOpacity=".55" />
          <stop offset="1" stopColor="#d8ff9c" stopOpacity="0" />
        </radialGradient>
        <filter id="wp-cloud" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <rect width="1600" height="1000" fill="url(#wp-sky)" />

      <g filter="url(#wp-cloud)" fill="#fff">
        <ellipse cx="260" cy="210" rx="190" ry="42" opacity=".75" />
        <ellipse cx="380" cy="185" rx="120" ry="38" opacity=".7" />
        <ellipse cx="980" cy="140" rx="230" ry="46" opacity=".6" />
        <ellipse cx="1130" cy="170" rx="150" ry="40" opacity=".7" />
        <ellipse cx="1420" cy="330" rx="170" ry="34" opacity=".55" />
        <ellipse cx="640" cy="360" rx="160" ry="28" opacity=".5" />
      </g>

      <path
        d="M0 640C220 560 430 545 640 590s420 90 620 40 260-80 340-70V1000H0z"
        fill="url(#wp-hill-back)"
      />
      <path
        d="M0 760C260 610 560 600 820 680s520 140 780 60V1000H0z"
        fill="url(#wp-hill-front)"
      />
      <path
        d="M0 760C260 610 560 600 820 680s520 140 780 60V1000H0z"
        fill="url(#wp-light)"
      />
    </svg>
  );
}

export default Wallpaper;
