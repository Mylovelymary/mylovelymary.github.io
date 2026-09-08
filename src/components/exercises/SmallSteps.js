"use client";

import { useState } from "react";
import { SMALL_STEPS } from "@/data/exercises";
import ExIcon from "@/components/ExIcon";

// Рулетка крошечных шагов для состояния «пусто, нет сил».
export default function SmallSteps() {
  const [order] = useState(() =>
    [...SMALL_STEPS.keys()].sort(() => Math.random() - 0.5)
  );
  const [idx, setIdx] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  const step = SMALL_STEPS[order[idx % order.length]];

  return (
    <div className="center">
      <div className="deck-card" style={{ cursor: "default", flexDirection: "column", gap: 14, display: "flex" }}>
        <div style={{ color: "var(--mint)" }}>
          <ExIcon name={step.icon} size={46} strokeWidth={1.6} />
        </div>
        <div>{step.text}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        <button
          className="btn btn-mint"
          onClick={() => {
            setDoneCount((d) => d + 1);
            setIdx((i) => i + 1);
          }}
        >
          Сделано ✓ Дай следующий
        </button>
        <button className="btn" onClick={() => setIdx((i) => i + 1)}>
          Не могу такое, дай другое
        </button>
      </div>

      {doneCount > 0 && (
        <p className="fade-in" style={{ marginTop: 18, color: "var(--mint)", fontWeight: 600 }}>
          {doneCount === 1
            ? "Один шаг сделан. Это уже движение 🌱"
            : `Сделано шагов: ${doneCount}. Тихонько, но ты идёшь 🌱`}
        </p>
      )}

      <p className="dim" style={{ marginTop: 20, fontSize: "0.92rem" }}>
        Никаких «соберись». Один крошечный шаг за раз — этого достаточно.
      </p>
    </div>
  );
}
