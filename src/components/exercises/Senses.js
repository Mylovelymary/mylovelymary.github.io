"use client";

import { useState } from "react";
import { Eye, Hand, Ear, Wind, Utensils } from "lucide-react";

const CATS = [
  { target: 5, text: "вещей, которые ВИДИШЬ", Icon: Eye },
  { target: 4, text: "вещи, которые можешь ПОТРОГАТЬ", Icon: Hand },
  { target: 3, text: "звука, которые СЛЫШИШЬ", Icon: Ear },
  { target: 2, text: "запаха, которые ЧУВСТВУЕШЬ", Icon: Wind },
  { target: 1, text: "вкус во рту", Icon: Utensils },
];

// Классика 5-4-3-2-1: жми за каждый найденный предмет.
// Блок мягко «наливается» зелёным по мере кликов — без резких вспышек.
export default function Senses() {
  const [counts, setCounts] = useState([0, 0, 0, 0, 0]);

  const inc = (i) =>
    setCounts((c) => c.map((v, j) => (j === i && v < CATS[i].target ? v + 1 : v)));

  const complete = counts.every((c, i) => c === CATS[i].target);
  const reset = () => setCounts([0, 0, 0, 0, 0]);

  return (
    <div>
      {CATS.map((cat, i) => {
        const ratio = counts[i] / cat.target;
        const done = counts[i] === cat.target;
        const Icon = cat.Icon;
        return (
          <div
            key={i}
            className="step-item"
            onClick={() => inc(i)}
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              // от прозрачного к спокойному зелёному, по тонам с каждым кликом
              background: `rgba(127, 224, 195, ${(0.03 + ratio * 0.15).toFixed(3)})`,
              borderColor: `rgba(127, 224, 195, ${(0.08 + ratio * 0.34).toFixed(3)})`,
              opacity: 1,
              transition: "background 0.45s ease, border-color 0.45s ease",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span
                style={{
                  width: 34,
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  color: done ? "var(--mint)" : "var(--sky)",
                  transition: "color 0.4s ease",
                }}
              >
                <Icon size={22} />
              </span>
              <span>
                Найди и назови <b>{cat.target}</b> {cat.text}
              </span>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "1.2rem",
                color: done ? "var(--mint)" : "var(--text)",
                flexShrink: 0,
                marginLeft: 8,
                transition: "color 0.4s ease",
              }}
            >
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
