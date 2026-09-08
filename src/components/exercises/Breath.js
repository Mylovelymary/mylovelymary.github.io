"use client";

import { useEffect, useRef, useState } from "react";
import Penguin from "@/components/Penguin";

// Дыхательный шар. mode: "belly" (живот, свободный ритм 4/6) или "count" (на счёт, с выбором схемы).
const SCHEMES = {
  soft: { label: "Мягкое 4–6", phases: [["Вдох", 4], ["Выдох", 6]] },
  box: { label: "Квадрат 4-4-4-4", phases: [["Вдох", 4], ["Держим", 4], ["Выдох", 4], ["Пауза", 4]] },
  relax: { label: "4–7–8", phases: [["Вдох", 4], ["Держим", 7], ["Выдох", 8]] },
};

export default function Breath({ mode = "count" }) {
  const [scheme, setScheme] = useState(mode === "belly" ? "soft" : "box");
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [left, setLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const phases = SCHEMES[scheme].phases;
  const phasesRef = useRef(phases);
  phasesRef.current = phases;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      if (left > 1) {
        setLeft((s) => s - 1);
      } else {
        setPhaseIdx((i) => {
          const next = (i + 1) % phasesRef.current.length;
          if (next === 0) setCycles((c) => c + 1);
          setLeft(phasesRef.current[next][1]);
          return next;
        });
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [running, left]);

  const start = () => {
    setPhaseIdx(0);
    setLeft(phases[0][1]);
    setCycles(0);
    setRunning(true);
  };

  const [label] = phases[phaseIdx];
  const inhaling = label === "Вдох";
  const holding = label === "Держим" || label === "Пауза";

  const scale = !running ? 1 : inhaling ? 1.28 : holding ? (phaseIdx > 0 && phases[phaseIdx - 1][0] === "Вдох" ? 1.28 : 0.85) : 0.85;

  return (
    <div className="center">
      {mode === "count" && (
        <div className="chip-row" style={{ justifyContent: "center", marginBottom: 14 }}>
          {Object.entries(SCHEMES).map(([k, s]) => (
            <button
              key={k}
              className={`chip ${scheme === k ? "selected" : ""}`}
              onClick={() => {
                setScheme(k);
                setRunning(false);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* высота с запасом под увеличение шара, чтобы он не налезал на текст */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "min(280px, 72vw)",
          margin: "6px 0 10px",
        }}
      >
        <div
          className="breath-sphere"
          style={{
            transform: `scale(${scale})`,
            transitionDuration: running ? `${phases[phaseIdx][1]}s` : "1s",
          }}
        >
          {running ? (
            <div>
              <div>{label}</div>
              <div style={{ fontSize: "2rem", textAlign: "center" }}>{left}</div>
            </div>
          ) : (
            <Penguin pose="breathe" size={100} />
          )}
        </div>
      </div>

      <button className={`btn btn-big ${running ? "" : "btn-sky"}`} onClick={() => (running ? setRunning(false) : start())}>
        {running ? "Стоп" : "Дышать вместе с Пином"}
      </button>

      {cycles >= 3 && (
        <p className="fade-in" style={{ marginTop: 14, color: "var(--mint)", fontWeight: 600 }}>
          Циклов: {cycles}. Уже что-то меняется? Если нет — смело пробуй другое упражнение.
        </p>
      )}

      {mode === "belly" && (
        <p className="dim" style={{ marginTop: 16, fontSize: "0.92rem", lineHeight: 1.5 }}>
          Одна рука на груди, другая на животе. Дыши так, чтобы двигалась только нижняя
          рука: вдох — живот надувается, выдох — сдувается. Грудь почти неподвижна.
          Смотри, как дышит Пин — у него животом получается отлично.
        </p>
      )}
    </div>
  );
}
