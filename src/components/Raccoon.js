// Хагси — енот владелицы проекта (Gemini).
// Оставлен один спокойный кадр: портрет с лапками на пузике, без анимаций —
// движущиеся позы владелице не понравились (дёргались).
const PORTRAIT = { src: "/hugsy.webp", ratio: 826 / 685 };

export default function Raccoon({ size = 150, style }) {
  const h = Math.round(size * PORTRAIT.ratio);

  return (
    <span className="hugsy" style={{ width: size, height: h, ...style }} aria-hidden="true">
      <span className="hugsy-shadow" />
      <span className="hugsy-body">
        <img src={PORTRAIT.src} alt="" width={size} height={h} draggable={false} />
      </span>
    </span>
  );
}
