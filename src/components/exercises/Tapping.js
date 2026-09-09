"use client";

import { useEffect, useRef, useState } from "react";
import { vibrate } from "@/lib/store";
import { tick } from "@/lib/sound";
import Raccoon from "@/components/Raccoon";

// Метроном для похлопываний «бабочка». Обезьянка показывает позу,
// кружки Л/П подсвечиваются в ритме — хлопай той ладонью, которая загорелась.
export default function Tapping() {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [side, setSide] = useState(0); // 0 — левая, 1 — правая
  const [beats, setBeats] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!playing) return;
    const interval = 60000 / bpm;
    timerRef.current = setInterval(() => {
      setSide((s) => 1 - s);
      setBeats((b) => b + 1);
      vibrate(30);
      tick();
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [playing, bpm]);

  return (
    <div className="center">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          margin: "6px 0 18px",
        }}
      >
        <div className={`tap-side ${playing && side === 0 ? "hit" : ""}`}>Л</div>
        <div
          style={{
            transform: playing ? `rotate(${side === 0 ? -7 : 7}deg)` : "none",
            transition: "transform 0.25s ease",
            transformOrigin: "50% 90%",
          }}
        >
          <Raccoon pose={playing ? "still" : "hug"} size={150} />
        </div>
        <div className={`tap-side ${playing && side === 1 ? "hit" : ""}`}>П</div>
      </div>

      <p className="muted" style={{ marginBottom: 18 }}>
        Держи руки как Хагси. Хлопай той ладонью, чей кружок загорается.
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
        Можно выбивать любимый ритм — строчку песни, что угодно. Если есть место —
        одновременно ходи по комнате: движение выводит адреналин быстрее всего.
      </p>
    </div>
  );
}
