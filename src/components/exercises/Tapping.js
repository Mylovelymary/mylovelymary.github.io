"use client";

import { useEffect, useRef, useState } from "react";
import { vibrate } from "@/lib/store";

// Метроном для похлопываний «бабочка»: подсвечивает левое/правое плечо в ритме.
export default function Tapping() {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [side, setSide] = useState(0); // 0 — левое, 1 — правое
  const [beats, setBeats] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!playing) return;
    const interval = 60000 / bpm;
    timerRef.current = setInterval(() => {
      setSide((s) => 1 - s);
      setBeats((b) => b + 1);
      vibrate(30);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [playing, bpm]);

  return (
    <div className="center">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px 0 24px",
          gap: 12,
        }}
      >
        <div className={`tap-side ${playing && side === 0 ? "hit" : ""}`}>🫲</div>
        <div style={{ fontSize: "2.2rem" }}>🦋</div>
        <div className={`tap-side ${playing && side === 1 ? "hit" : ""}`}>🫱</div>
      </div>

      <p className="muted" style={{ marginBottom: 18 }}>
        Хлопай той ладонью, чья сторона загорается.
        {beats > 0 && ` Хлопков: ${beats}`}
      </p>

      <button
        className={`btn btn-big ${playing ? "" : "btn-lavender"}`}
        onClick={() => setPlaying((p) => !p)}
      >
        {playing ? "Пауза" : beats ? "Продолжить" : "Начать ритм"}
      </button>

      <div style={{ marginTop: 20 }}>
        <p className="dim" style={{ fontSize: "0.9rem", marginBottom: 8 }}>
          Темп: {bpm} ударов в минуту
        </p>
        <input
          type="range"
          min="50"
          max="130"
          step="5"
          value={bpm}
          onChange={(e) => setBpm(+e.target.value)}
          style={{ width: "80%" }}
        />
      </div>

      <p className="dim" style={{ marginTop: 22, fontSize: "0.92rem" }}>
        Можно выбивать любимый ритм — «Спар-так — чем-пи-он», строчку песни, что угодно.
        Ходи по комнате, если есть место: движение + похлопывания выводят адреналин быстрее всего.
      </p>
    </div>
  );
}
