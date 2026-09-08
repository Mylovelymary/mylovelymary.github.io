"use client";

import { useEffect, useRef, useState } from "react";

// EMDR-шарик: плавно летает от края до края, следить только глазами.
export default function Emdr() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1800); // мс на один пролёт
  const ballRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    let start = null;
    const animate = (ts) => {
      if (start === null) start = ts;
      const sp = speedRef.current;
      const elapsed = ts - start;
      const progress = (elapsed % sp) / sp;
      const dir = Math.floor(elapsed / sp) % 2 === 0 ? 1 : -1;

      if (ballRef.current && trackRef.current) {
        const max = trackRef.current.offsetWidth - ballRef.current.offsetWidth;
        const ease = (Math.sin(progress * Math.PI - Math.PI / 2) + 1) / 2;
        const x = dir === 1 ? ease * max : max - ease * max;
        ballRef.current.style.transform = `translateX(${x}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <div className="center">
      <div ref={trackRef} className="emdr-track" style={{ margin: "30px 0" }}>
        <div ref={ballRef} className="emdr-ball" />
      </div>

      <button
        className={`btn btn-big ${playing ? "" : "btn-sky"}`}
        onClick={() => setPlaying((p) => !p)}
      >
        {playing ? "Пауза" : "Запустить шарик"}
      </button>

      <div style={{ marginTop: 20 }}>
        <p className="dim" style={{ fontSize: "0.9rem", marginBottom: 8 }}>
          Скорость: {speed <= 1300 ? "быстро" : speed <= 2000 ? "средне" : "медленно"}
        </p>
        <input
          type="range"
          min="900"
          max="3000"
          step="100"
          value={3900 - speed}
          onChange={(e) => setSpeed(3900 - +e.target.value)}
          style={{ width: "80%" }}
        />
      </div>

      <p className="dim" style={{ marginTop: 22, fontSize: "0.92rem", lineHeight: 1.5 }}>
        Голова неподвижна, работают только глаза. Лучше всего — с экрана компьютера или
        планшета: чем шире «разгон» для глаз, тем сильнее эффект. Нет экрана — просто
        быстро переводи взгляд из одного угла комнаты в другой.
      </p>
    </div>
  );
}
