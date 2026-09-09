"use client";

import { useEffect, useState } from "react";
import { vibrate } from "@/lib/store";
import { chime } from "@/lib/sound";

const MOVES = [
  { label: "Приседания" },
  { label: "Прыжки" },
  { label: "Бег на месте" },
  { label: "Отжимания от стены" },
];

// Сброс адреналина: раунды по 30 секунд интенсивного движения.
export default function Burn() {
  const [moveIdx, setMoveIdx] = useState(0);
  const [left, setLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      setRounds((r) => r + 1);
      vibrate([100, 80, 100]);
      chime();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left]);

  const start = () => {
    setLeft(30);
    setRunning(true);
  };

  const move = MOVES[moveIdx];

  return (
    <div className="center">
      <div className="chip-row" style={{ justifyContent: "center", marginBottom: 10 }}>
        {MOVES.map((m, i) => (
          <button
            key={m.label}
            className={`chip ${i === moveIdx ? "selected" : ""}`}
            onClick={() => setMoveIdx(i)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className={`big-number ${running ? "pulse-ring" : ""}`} style={{ color: left === 0 ? "var(--mint)" : "var(--text)" }}>
        {left}
      </div>

      <p className="muted" style={{ margin: "8px 0 24px" }}>
        {running
          ? `${move.label} — не останавливайся!`
          : rounds > 0
            ? `Раунд ${rounds} сделан. Пульс постучит и успокоится — так и надо.`
            : "30 секунд на максимум. Поехали?"}
      </p>

      {!running ? (
        <button className="btn btn-sos" onClick={start}>
          {rounds > 0 ? "Ещё раунд" : "Старт"}
        </button>
      ) : (
        <button className="btn" onClick={() => setRunning(false)}>
          Пауза
        </button>
      )}

      {rounds >= 2 && (
        <p className="fade-in" style={{ marginTop: 18, color: "var(--mint)", fontWeight: 600 }}>
          Два раунда! Адреналину уже нечем заняться 💪
        </p>
      )}
    </div>
  );
}
