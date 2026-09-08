import { useId } from "react";

// Хагси — талисман Аптечки. Оригинальный SVG: большая голова, белая мордочка,
// красно-белый шарф. Позы: calm (покачивается), wave (машет крылом),
// still (только моргает — для синхронного дыхания), cheer (радуется).
// Весит пару килобайт, анимации на чистом CSS.
export default function Penguin({ pose = "calm", size = 140, style }) {
  const uid = useId().replace(/[:]/g, "");
  const dark = `pgDark-${uid}`;
  const white = `pgWhite-${uid}`;
  const scarfClip = `pgScarf-${uid}`;
  const tailClip = `pgTail-${uid}`;

  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={`penguin p-${pose}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={dark} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d4763" />
          <stop offset="100%" stopColor="#232a40" />
        </linearGradient>
        <linearGradient id={white} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e9f4" />
        </linearGradient>
        <clipPath id={scarfClip}>
          <path d="M56 128 Q100 146 144 128 L146 144 Q100 164 54 144 Z" />
        </clipPath>
        <clipPath id={tailClip}>
          <path d="M112 140 L136 142 L134 190 Q123 197 110 190 Z" />
        </clipPath>
      </defs>

      <ellipse className="p-shadow" cx="100" cy="228" rx="52" ry="8" fill="rgba(0,0,0,0.32)" />

      <g className="p-body">
        {/* крылья */}
        <path
          className="p-flip p-flip-l"
          d="M56 142 C 30 152 22 186 32 206 C 46 196 54 172 60 154 Z"
          fill="#242b44"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />
        <path
          className="p-flip p-flip-r"
          d="M144 142 C 170 152 178 186 168 206 C 154 196 146 172 140 154 Z"
          fill="#242b44"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />

        {/* лапки */}
        <path d="M70 216 Q64 230 80 228 Q92 227 88 215 Z" fill="#f2a137" />
        <path d="M130 216 Q136 230 120 228 Q108 227 112 215 Z" fill="#f2a137" />

        {/* тело */}
        <ellipse cx="100" cy="172" rx="52" ry="52" fill={`url(#${dark})`} />
        <g className="p-belly">
          <ellipse cx="100" cy="178" rx="36" ry="40" fill={`url(#${white})`} />
        </g>

        {/* голова */}
        <circle cx="100" cy="74" r="56" fill={`url(#${dark})`} />
        {/* хохолок */}
        <path d="M88 22 Q83 8 74 4 Q90 7 94 17 Z" fill="#2b3244" />
        <path d="M100 19 Q100 4 100 0 Q108 7 104 18 Z" fill="#2b3244" />
        <path d="M112 22 Q118 9 126 5 Q111 8 106 18 Z" fill="#2b3244" />
        {/* мордочка */}
        <ellipse cx="79" cy="88" rx="27" ry="31" fill={`url(#${white})`} />
        <ellipse cx="121" cy="88" rx="27" ry="31" fill={`url(#${white})`} />
        {/* глаза */}
        <g className="p-eyes">
          <circle cx="80" cy="76" r="10" fill="#1d2333" />
          <circle cx="120" cy="76" r="10" fill="#1d2333" />
          <circle cx="83.5" cy="72.5" r="3.6" fill="#fff" />
          <circle cx="123.5" cy="72.5" r="3.6" fill="#fff" />
          <circle cx="77" cy="80" r="1.6" fill="#fff" opacity="0.8" />
          <circle cx="117" cy="80" r="1.6" fill="#fff" opacity="0.8" />
        </g>
        {/* щёчки */}
        <ellipse cx="70" cy="97" rx="9" ry="5.5" fill="#ff9d9d" opacity="0.5" />
        <ellipse cx="130" cy="97" rx="9" ry="5.5" fill="#ff9d9d" opacity="0.5" />
        {/* клюв */}
        <path d="M90 92 L100 87 L110 92 L100 104 Z" fill="#f7a23b" />
        <path d="M94 98 L100 104 L106 98 Q100 102 94 98 Z" fill="#dd8a25" />

        {/* шарф */}
        <path d="M56 128 Q100 146 144 128 L146 144 Q100 164 54 144 Z" fill="#e5484d" />
        <g clipPath={`url(#${scarfClip})`}>
          <rect x="62" y="120" width="10" height="50" fill="#fff" transform="rotate(-8 67 145)" opacity="0.92" />
          <rect x="86" y="124" width="10" height="50" fill="#fff" transform="rotate(-3 91 149)" opacity="0.92" />
          <rect x="110" y="124" width="10" height="50" fill="#fff" transform="rotate(3 115 149)" opacity="0.92" />
          <rect x="132" y="120" width="10" height="50" fill="#fff" transform="rotate(8 137 145)" opacity="0.92" />
        </g>
        <path d="M112 140 L136 142 L134 190 Q123 197 110 190 Z" fill="#e5484d" />
        <g clipPath={`url(#${tailClip})`}>
          <rect x="104" y="152" width="40" height="9" fill="#fff" transform="rotate(2 124 156)" opacity="0.92" />
          <rect x="104" y="170" width="40" height="9" fill="#fff" transform="rotate(2 124 174)" opacity="0.92" />
        </g>
        <path d="M114 190 L113 198 M121 193 L121 201 M128 191 L129 199" stroke="#e5484d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
