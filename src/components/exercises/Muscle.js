"use client";

import { useEffect, useState } from "react";
import { vibrate } from "@/lib/store";
import { success } from "@/lib/sound";
import { Grab, Dumbbell, ChevronsUp, ScanFace, Shield, PersonStanding, Footprints, Waves } from "lucide-react";

const GROUPS = [
  { Icon: Grab, name: "Кулаки", tense: "Сожми кулаки изо всех сил" },
  { Icon: Dumbbell, name: "Руки", tense: "Согни руки и напряги бицепсы" },
  { Icon: ChevronsUp, name: "Плечи", tense: "Подними плечи к ушам как можно выше" },
  { Icon: ScanFace, name: "Лицо", tense: "Зажмурься и сожми челюсти" },
  { Icon: Shield, name: "Живот", tense: "Напряги живот, как перед ударом" },
  { Icon: PersonStanding, name: "Ноги", tense: "Вытяни ноги и напряги бёдра" },
  { Icon: Footprints, name: "Стопы", tense: "Подожми пальцы ног, напряги стопы" },
];

const TENSE_SEC = 5;
const RELAX_SEC = 8;

// Прогрессивная мышечная релаксация: напряжение 5 сек, затем резкое расслабление.
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

  const goTo = (i) => {
    setGi(i);
    setPhase("tense");
    setLeft(TENSE_SEC);
  };

  if (gi < 0) {
    return (
      <div className="center">
        <div style={{ color: "var(--lavender)", display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <PersonStanding size={54} strokeWidth={1.6} />
        </div>
        <p className="muted" style={{ marginBottom: 22, lineHeight: 1.5 }}>
          7 групп мышц. Каждую — сильно напрячь на 5 секунд, потом резко отпустить
          и прочувствовать разницу. Сядь или ляг поудобнее.
        </p>
        <button className="btn btn-lavender btn-big" onClick={() => goTo(0)}>
          Начать
        </button>
      </div>
    );
  }

  if (gi >= GROUPS.length) {
    return (
      <div className="center fade-in">
        <div style={{ color: "var(--mint)", display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <Waves size={50} strokeWidth={1.6} />
        </div>
        <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 10 }}>Всё тело пройдено.</p>
        <p className="muted" style={{ marginBottom: 20 }}>
          Посиди ещё несколько секунд и просто послушай, каким тяжёлым и тёплым стало тело.
        </p>
        <button className="btn" onClick={() => setGi(-1)}>Пройти ещё раз</button>
      </div>
    );
  }

  const g = GROUPS[gi];
  const Icon = g.Icon;
  const tensing = phase === "tense";

  return (
    <div className="center">
      {/* точки-группы: пройденные приглушены, текущая яркая. Можно кликать и переходить */}
      <div className="group-dots" style={{ marginBottom: 22 }}>
        {GROUPS.map((grp, i) => (
          <button
            key={i}
            className={`group-dot ${i < gi ? "done" : ""} ${i === gi ? "current" : ""}`}
            onClick={() => goTo(i)}
            title={grp.name}
            aria-label={grp.name}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 10,
          color: tensing ? "var(--peach)" : "var(--mint)",
          transition: "color 0.4s ease",
        }}
      >
        <Icon size={52} strokeWidth={1.7} />
      </div>
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

      <p className="dim" style={{ marginTop: 18, fontSize: "0.88rem" }}>
        Точки сверху — группы мышц. Нажми на любую, чтобы перейти к ней.
      </p>
    </div>
  );
}
