"use client";

import { useEffect, useRef, useState } from "react";
import Raccoon from "@/components/Raccoon";

// Дыхание с Хагси: енот надувается на вдохе и сдувается на выдохе.
// У каждой фазы своя полоска, её ширина пропорциональна длительности —
// видно, что вдох короче выдоха. «Квадрат» рисуется настоящим квадратом.
const SCHEMES = {
  soft: { label: "Мягкое 4–6", phases: [["Вдох", 4], ["Выдох", 6]] },
  box: { label: "Квадрат 4-4-4-4", phases: [["Вдох", 4], ["Держим", 4], ["Выдох", 4], ["Пауза", 4]] },
  relax: { label: "4–7–8", phases: [["Вдох", 4], ["Держим", 7], ["Выдох", 8]] },
};

// Цвет фазы: вдох — голубой, задержка — лаванда, выдох — мята
const PHASE_COLOR = {
  Вдох: "var(--sky)",
  Держим: "var(--lavender)",
  Выдох: "var(--mint)",
  Пауза: "var(--text-dim)",
};

const SIDES = ["top", "right", "bottom", "left"];

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

  const [label, phaseDur] = phases[phaseIdx];
  const inhaling = label === "Вдох";
  const holding = label === "Держим" || label === "Пауза";
  const afterInhale = holding && phaseIdx > 0 && phases[phaseIdx - 1][0] === "Вдох";
  const isBox = scheme === "box";

  // Хагси «надувается»: на вдохе раздувается вширь и вверх, на выдохе оседает.
  // Точка опоры — лапки, чтобы он рос от земли, а не парил.
  const [sx, sy] = !running ? [1, 1] : inhaling || afterInhale ? [1.12, 1.18] : [1, 0.93];

  const hagsi = (
    <div
      style={{
        transform: `scale(${sx}, ${sy})`,
        transformOrigin: "50% 88%",
        transition: `transform ${running ? phaseDur : 1}s cubic-bezier(0.4, 0, 0.2, 1)`,
        filter: "drop-shadow(0 0 30px rgba(124, 199, 242, 0.25))",
      }}
    >
      <Raccoon pose={running ? "still" : "calm"} size={isBox ? 118 : 150} />
    </div>
  );

  return (
    <div className="center">
      {mode === "count" && (
        <div className="chip-row" style={{ justifyContent: "center", marginBottom: 10 }}>
          {Object.entries(SCHEMES).map(([k, s]) => (
            <button
              key={k}
              className={`chip ${scheme === k ? "selected" : ""}`}
              onClick={() => {
                setScheme(k);
                setRunning(false);
                setPhaseIdx(0);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* подпись фазы — фиксированной высоты, чтобы ничего не прыгало */}
      <div style={{ height: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end", marginBottom: 4 }}>
        {running ? (
          <p style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.5rem", color: PHASE_COLOR[label] }}>
            {label}
            <span style={{ marginLeft: 10, fontVariantNumeric: "tabular-nums" }}>{left}</span>
          </p>
        ) : (
          <p className="muted">Дыши вместе с Хагси: он надувается — вдох, сдувается — выдох.</p>
        )}
      </div>

      {isBox ? (
        /* Квадратное дыхание: Хагси внутри квадрата, огонёк бежит по сторонам */
        <div className="box-track">
          {SIDES.map((side, i) => {
            const active = running && i === phaseIdx;
            const done = running && i < phaseIdx;
            return (
              <div key={side} className={`box-side ${side}`}>
                {(active || done) && (
                  <div
                    key={active ? `${cycles}-${i}` : `done-${i}`}
                    className={`box-fill ${side} ${active ? "active" : "done"}`}
                    style={active ? { animationDuration: `${phaseDur}s` } : undefined}
                  />
                )}
              </div>
            );
          })}
          {running && (
            <div
              key={`dot-${cycles}-${phaseIdx}`}
              className={`box-dot dot-${SIDES[phaseIdx]}`}
              style={{ animationDuration: `${phaseDur}s` }}
            />
          )}
          <div className="box-center">{hagsi}</div>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "min(230px, 60vw)",
              margin: "4px 0 2px",
            }}
          >
            {hagsi}
          </div>

          {/* по полоске на каждую фазу: ширина пропорциональна секундам */}
          <div className="phase-bars">
            {phases.map(([lbl, dur], i) => {
              const active = running && i === phaseIdx;
              const done = running && i < phaseIdx;
              return (
                <div key={lbl} className="phase-seg" style={{ flexGrow: dur }}>
                  <div className="seg-label" style={{ color: active ? PHASE_COLOR[lbl] : "var(--text-dim)" }}>
                    {lbl} · {dur} сек
                  </div>
                  <div className="seg-track">
                    {(active || done) && (
                      <div
                        key={active ? `${cycles}-${i}` : `done-${i}`}
                        className={`seg-fill ${active ? "active" : "done"}`}
                        style={{
                          background: PHASE_COLOR[lbl],
                          animationDuration: active ? `${dur}s` : undefined,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <button className={`btn btn-big ${running ? "" : "btn-sky"}`} onClick={() => (running ? setRunning(false) : start())}>
        {running ? "Стоп" : "Дышать с Хагси"}
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
          У Хагси животом получается отлично — повторяй за ним.
        </p>
      )}
    </div>
  );
}
