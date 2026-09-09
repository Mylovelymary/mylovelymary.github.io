import { Snowflake, GlassWater, Mic, Heart } from "lucide-react";

// Хагси — енот владелицы проекта (Gemini): портрет + кадры движений из её видео.
// Кадры stand/up/jump вырезаны из видео единым прямоугольником, поэтому позы
// совпадают по масштабу и положению — их можно честно чередовать.
//
// Позы:
//   calm — портрет, покачивается         wave — машет обеими лапами (stand↔up)
//   still — портрет, неподвижен          cheer — руки вверх + прыжки
//   hug/shiver/groove — портрет (+ предмет в лапках)
//   raise — руки вверх ↔ резкий сброс    squat — приседает   jump — прыгает
const FRAMES = {
  portrait: { src: "/hugsy.webp", ratio: 826 / 685 },
  stand: { src: "/hugsy-stand.webp", ratio: 689 / 621 },
  up: { src: "/hugsy-up.webp", ratio: 689 / 621 },
  jump: { src: "/hugsy-jump.webp", ratio: 689 / 621 },
};

// Кадры позы: один или пара [основной, второй] для чередования
const POSE_FRAMES = {
  calm: ["portrait"],
  still: ["portrait"],
  hug: ["portrait"],
  shiver: ["portrait"],
  groove: ["portrait"],
  wave: ["stand", "up"],
  raise: ["up", "stand"],
  cheer: ["up"],
  squat: ["stand"],
  jump: ["jump"],
};

const ITEMS = {
  ice: { Icon: Snowflake, color: "#3aa7dd", bg: "rgba(120, 200, 255, 0.25)" },
  glass: { Icon: GlassWater, color: "#2b8fd4", bg: "rgba(120, 200, 255, 0.2)" },
  mic: { Icon: Mic, color: "#7461cf", bg: "rgba(160, 140, 240, 0.2)" },
  heart: { Icon: Heart, color: "#e05f7a", bg: "rgba(240, 130, 150, 0.2)" },
};

export default function Raccoon({ pose = "calm", size = 150, item = null, style }) {
  const frames = POSE_FRAMES[pose] || POSE_FRAMES.calm;
  const ratio = FRAMES[frames[0]].ratio;
  const it = item ? ITEMS[item] : null;
  const h = Math.round(size * ratio);

  return (
    <span
      className={`hugsy hg-${pose}`}
      style={{ width: size, height: h, ...style }}
      aria-hidden="true"
    >
      <span className="hugsy-shadow" />
      <span className="hugsy-body">
        {frames.map((f, i) => (
          <img
            key={f}
            className={`hg-frame ${i === 0 ? "f-a" : "f-b"}`}
            src={FRAMES[f].src}
            alt=""
            width={size}
            height={h}
            draggable={false}
          />
        ))}
        {it && (
          <span className="hg-item" style={{ background: it.bg }}>
            <it.Icon size={Math.max(18, size * 0.16)} color={it.color} strokeWidth={2.2} />
          </span>
        )}
      </span>
    </span>
  );
}
