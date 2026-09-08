"use client";

import { useState } from "react";

const CATS = [
  { target: 5, text: "вещей, которые ВИДИШЬ", icon: "👁️" },
  { target: 4, text: "вещи, которые можешь ПОТРОГАТЬ", icon: "🖐️" },
  { target: 3, text: "звука, которые СЛЫШИШЬ", icon: "👂" },
  { target: 2, text: "запаха, которые ЧУВСТВУЕШЬ", icon: "👃" },
  { target: 1, text: "вкус во рту", icon: "👅" },
];

// Классика 5-4-3-2-1 — по-честному интерактивная: жми за каждый найденный предмет.
export default function Senses() {
  const [counts, setCounts] = useState([0, 0, 0, 0, 0]);

  const inc = (i) =>
    setCounts((c) => c.map((v, j) => (j === i && v < CATS[i].target ? v + 1 : v)));

  const complete = counts.every((c, i) => c === CATS[i].target);
  const reset = () => setCounts([0, 0, 0, 0, 0]);

  return (
    <div>
      {CATS.map((cat, i) => {
        const done = counts[i] === cat.target;
        return (
          <div
            key={i}
            className={`step-item ${done ? "done" : ""}`}
            onClick={() => inc(i)}
            style={{ justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: "1.5rem", width: 34, textAlign: "center", flexShrink: 0 }}>{cat.icon}</span>
              <span>
                Найди и назови <b>{cat.target}</b> {cat.text}
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", color: done ? "var(--mint)" : "var(--text)", flexShrink: 0, marginLeft: 8 }}>
              {counts[i]}/{cat.target}
            </div>
          </div>
        );
      })}

      {complete && (
        <div className="center fade-in" style={{ marginTop: 16 }}>
          <p style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--mint)", marginBottom: 14 }}>
            Все чувства на месте — и ты здесь, в настоящем 💙
          </p>
          <button className="btn" onClick={reset}>Ещё круг</button>
        </div>
      )}
    </div>
  );
}
