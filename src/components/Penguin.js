import { useId } from "react";

// Пин — талисман Аптечки. Оригинальный SVG: пухлый пингвин в красно-белом шарфе.
// Позы: calm (тихо покачивается), wave (машет крылом), breathe (дышит животом),
// cheer (радуется, оба крыла вверх). Весит пару килобайт, анимации на чистом CSS.
export default function Penguin({ pose = "calm", size = 140, style }) {
  const uid = useId().replace(/[:]/g, "");
  const bodyGrad = `pgBody-${uid}`;
  const bellyGrad = `pgBelly-${uid}`;
  const scarfClip = `pgScarf-${uid}`;
  const tailClip = `pgTail-${uid}`;

  return (
    <svg
      viewBox="0 0 200 230"
      width={size}
      height={size * 1.15}
      className={`penguin p-${pose}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bodyGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4460" />
          <stop offset="100%" stopColor="#252c40" />
        </linearGradient>
        <linearGradient id={bellyGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dde5f0" />
        </linearGradient>
        <clipPath id={scarfClip}>
          <path d="M54 116 Q100 136 146 116 L148 134 Q100 156 52 134 Z" />
        </clipPath>
        <clipPath id={tailClip}>
          <path d="M106 130 L132 134 L128 184 Q117 191 104 184 Z" />
        </clipPath>
      </defs>

      <ellipse className="p-shadow" cx="100" cy="218" rx="54" ry="9" fill="rgba(0,0,0,0.32)" />

      <g className="p-body">
        {/* хохолок */}
        <path d="M90 25 Q86 12 78 8 Q92 10 96 20 Z" fill="#2b3244" />
        <path d="M100 22 Q100 8 100 3 Q107 10 104 21 Z" fill="#2b3244" />
        <path d="M110 25 Q115 12 122 9 Q109 12 105 21 Z" fill="#2b3244" />

        {/* левое крыло (за телом) */}
        <path
          className="p-flip p-flip-l"
          d="M46 96 C 20 112 12 152 24 174 C 38 162 48 132 56 110 Z"
          fill="#222941"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />
        {/* правое крыло */}
        <path
          className="p-flip p-flip-r"
          d="M154 96 C 180 112 188 152 176 174 C 162 162 152 132 144 110 Z"
          fill="#222941"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />

        {/* лапки */}
        <path d="M62 200 Q56 216 74 214 Q88 213 84 200 Z" fill="#f2a137" />
        <path d="M138 200 Q144 216 126 214 Q112 213 116 200 Z" fill="#f2a137" />

        {/* тело-яйцо */}
        <path
          d="M100 14 C 152 14 172 62 172 122 C 172 180 142 210 100 210 C 58 210 28 180 28 122 C 28 62 48 14 100 14 Z"
          fill={`url(#${bodyGrad})`}
        />
        {/* животик */}
        <g className="p-belly">
          <path
            d="M100 54 C 134 54 150 90 150 134 C 150 178 128 202 100 202 C 72 202 50 178 50 134 C 50 90 66 54 100 54 Z"
            fill={`url(#${bellyGrad})`}
          />
        </g>

        {/* глаза */}
        <g className="p-eyes">
          <ellipse cx="78" cy="82" rx="13" ry="15" fill="#fff" />
          <ellipse cx="122" cy="82" rx="13" ry="15" fill="#fff" />
          <circle cx="81" cy="85" r="7" fill="#22283a" />
          <circle cx="119" cy="85" r="7" fill="#22283a" />
          <circle cx="83.5" cy="82" r="2.4" fill="#fff" />
          <circle cx="121.5" cy="82" r="2.4" fill="#fff" />
        </g>

        {/* щёчки */}
        <ellipse cx="66" cy="102" rx="8.5" ry="5" fill="#ff9d9d" opacity="0.45" />
        <ellipse cx="134" cy="102" rx="8.5" ry="5" fill="#ff9d9d" opacity="0.45" />

        {/* клюв */}
        <path d="M88 97 L100 91 L112 97 L100 111 Z" fill="#f7a23b" />
        <path d="M92 103 L100 111 L108 103 Q100 108 92 103 Z" fill="#dd8a25" />

        {/* шарф: воротник с белыми полосками */}
        <path d="M54 116 Q100 136 146 116 L148 134 Q100 156 52 134 Z" fill="#e5484d" />
        <g clipPath={`url(#${scarfClip})`}>
          <rect x="62" y="110" width="10" height="50" fill="#fff" transform="rotate(-8 67 135)" opacity="0.92" />
          <rect x="86" y="112" width="10" height="50" fill="#fff" transform="rotate(-4 91 137)" opacity="0.92" />
          <rect x="110" y="112" width="10" height="50" fill="#fff" transform="rotate(2 115 137)" opacity="0.92" />
          <rect x="132" y="108" width="10" height="50" fill="#fff" transform="rotate(7 137 133)" opacity="0.92" />
        </g>
        {/* хвост шарфа */}
        <path d="M106 130 L132 134 L128 184 Q117 191 104 184 Z" fill="#e5484d" />
        <g clipPath={`url(#${tailClip})`}>
          <rect x="100" y="142" width="40" height="9" fill="#fff" transform="rotate(4 120 146)" opacity="0.92" />
          <rect x="100" y="160" width="40" height="9" fill="#fff" transform="rotate(4 120 164)" opacity="0.92" />
        </g>
        {/* бахрома */}
        <path d="M108 184 L107 192 M115 187 L115 195 M122 185 L123 193" stroke="#e5484d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
