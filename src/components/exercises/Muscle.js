"use client";

import { useEffect, useState } from "react";
import { vibrate } from "@/lib/store";
import { success } from "@/lib/sound";

const GROUPS = [
  { icon: "✊", name: "Кулаки", tense: "Сожми кулаки изо всех сил" },
  { icon: "💪", name: "Руки", tense: "Согни руки и напряги бицепсы" },
  { icon: "🤷", name: "Плечи", tense: "Подними плечи к ушам как можно выше" },
  { icon: "😬", name: "Лицо", tense: "Зажмурься и сожми челюсти" },
  { icon: "🫁", name: "Живот", tense: "Напряги живот, как перед ударом" },
  { icon: "🦵", name: "Ноги", tense: "Вытяни ноги и напряги бёдра" },
  { icon: "🦶", name: "Стопы", tense: "Подожми пальцы ног, напряги стопы" },
];

const TENSE_SEC = 5;
const RELAX_SEC = 8;

// Прогрессивная мышечная релаксация: напряжение 5 сек → резкое расслабление.
export default function Muscle() {
  const [gi, setGi] = useState(-1); // -1 — не начали
  const [phase, setPhase] = useState("tense");
  const [left, setLeft] = useState(TENSE_SEC);

  useEffect(() => {
    if (gi === GROUPS.length) success();
    if (gi < 0 || gi >= GROUPS.length) return;
    if (left > 0) {
      const t = setTimeout(() => setLeft((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "tense") {
      vibrate(80);
      setPhase("relax");
      setLeft(RELAX_SEC);
    } else {
      setPhase("tense");
      setLeft(TENSE_SEC);
      setGi((i) => i + 1);
    }
  }, [gi, phase, left]);

  if (gi < 0) {
    return (
      <div className="center">
        <div style={{ fontSize: "3.2rem", marginBottom: 14 }}>🧘</div>
        <p className="muted" style={{ marginBottom: 22, lineHeight: 1.5 }}>
          7 групп мышц. Каждую — сильно напрячь на 5 секунд, потом резко отпустить
          и прочувствовать разницу. Сядь или ляг поудобнее.
        </p>
        <button className="btn btn-lavender btn-big" onClick={() => { setGi(0); setPhase("tense"); setLeft(TENSE_SEC); }}>
          Начать
        </button>
      </div>
    );
  }

  if (gi >= GROUPS.length) {
    return (
      <div className="center fade-in">
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🌊</div>
        <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 10 }}>Всё тело пройдено.</p>
        <p className="muted" style={{ marginBottom: 20 }}>
          Посиди ещё несколько секунд и просто послушай, каким тяжёлым и тёплым стало тело.
        </p>
        <button className="btn" onClick={() => setGi(-1)}>Пройти ещё раз</button>
      </div>
    );
  }

  const g = GROUPS[gi];
  const tensing = phase === "tense";

  return (
    <div className="center">
      <div className="progress-dots" style={{ marginBottom: 20 }}>
        {GROUPS.map((_, i) => (
          <span key={i} className={i < gi ? "on" : ""} />
        ))}
      </div>
      <div style={{ fontSize: "3.4rem", marginBottom: 8 }}>{g.icon}</div>
      <p style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: 6 }}>{g.name}</p>
      <p className="muted" style={{ marginBottom: 16, minHeight: 48 }}>
        {tensing ? g.tense + "!" : "А теперь отпусти. Совсем. Почувствуй, как тепло разливается по мышцам…"}
      </p>
      <div
        className={`big-number ${tensing ? "pulse-ring" : ""}`}
        style={{ color: tensing ? "var(--peach)" : "var(--mint)" }}
      >
        {left}
      </div>
      <p className="dim" style={{ marginTop: 10 }}>{tensing ? "напрягаем" : "расслабляем"}</p>
    </div>
  );
}
