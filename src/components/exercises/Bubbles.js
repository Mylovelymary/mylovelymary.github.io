"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { vibrate } from "@/lib/store";

const COLORS = [
  { name: "синие", css: "rgba(124, 199, 242, 0.85)" },
  { name: "мятные", css: "rgba(127, 224, 195, 0.85)" },
  { name: "персиковые", css: "rgba(255, 179, 133, 0.85)" },
  { name: "сиреневые", css: "rgba(184, 167, 245, 0.85)" },
];

let uid = 0;

// Игра-переключалка: лопай шарики только заданного цвета.
export default function Bubbles() {
  const [target, setTarget] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const areaRef = useRef(null);

  const spawn = useCallback(() => {
    const size = 44 + Math.random() * 46;
    return {
      id: uid++,
      color: Math.floor(Math.random() * COLORS.length),
      x: Math.random() * (100 - (size / 3.2)),
      y: Math.random() * (100 - (size / 2.6)),
      size,
    };
  }, []);

  const start = () => {
    setTarget(Math.floor(Math.random() * COLORS.length));
    setBubbles(Array.from({ length: 7 }, spawn));
    setScore(0);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setBubbles((bs) => (bs.length < 10 ? [...bs, spawn()] : bs));
    }, 900);
    return () => clearInterval(t);
  }, [playing, spawn]);

  const pop = (b) => {
    if (b.color === target) {
      vibrate(20);
      setScore((s) => s + 1);
      setBubbles((bs) => bs.filter((x) => x.id !== b.id).concat(spawn()));
      // время от времени меняем целевой цвет, чтобы мозг не скучал
      if ((score + 1) % 8 === 0) setTarget(Math.floor(Math.random() * COLORS.length));
    } else {
      setBubbles((bs) => bs.map((x) => (x.id === b.id ? { ...x, shake: !x.shake } : x)));
    }
  };

  if (!playing) {
    return (
      <div className="center">
        <div style={{ fontSize: "3.4rem", marginBottom: 14 }}>🫧</div>
        <p className="muted" style={{ marginBottom: 20 }}>
          Лопай только шарики нужного цвета. Цвет будет меняться — следи за подсказкой.
        </p>
        <button className="btn btn-sky btn-big" onClick={start}>
          Играть
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
          Лопай{" "}
          <span style={{ color: COLORS[target].css.replace("0.85", "1"), textShadow: "0 0 14px " + COLORS[target].css }}>
            {COLORS[target].name}
          </span>
        </span>
        <span className="muted">Счёт: {score}</span>
      </div>
      <div
        ref={areaRef}
        style={{
          position: "relative",
          width: "100%",
          height: "min(52vh, 460px)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {bubbles.map((b) => (
          <button
            key={b.id}
            className="bubble"
            onClick={() => pop(b)}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.55), ${COLORS[b.color].css})`,
            }}
            aria-label="шарик"
          />
        ))}
      </div>
      <button className="btn-ghost" style={{ margin: "10px auto 0", display: "block" }} onClick={() => setPlaying(false)}>
        Хватит играть
      </button>
    </div>
  );
}
