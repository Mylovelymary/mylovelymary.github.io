"use client";

import { useEffect, useState } from "react";
import { vibrate } from "@/lib/store";
import { chime } from "@/lib/sound";

// «Резкий сброс»: руки вверх → резкий выдох, локти вниз. 30 раз, минута отдыха, ещё 30.
export default function ArmDrop() {
  const [count, setCount] = useState(0);
  const [set_, setSet] = useState(1);
  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(60);

  useEffect(() => {
    if (!resting) return;
    if (restLeft <= 0) {
      setResting(false);
      setRestLeft(60);
      setCount(0);
      setSet(2);
      vibrate([100, 80, 100]);
      chime();
      return;
    }
    const t = setTimeout(() => setRestLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resting, restLeft]);

  const tap = () => {
    vibrate(25);
    const next = count + 1;
    setCount(next);
    if (next >= 30 && set_ === 1) setResting(true);
  };

  if (resting) {
    return (
      <div className="center fade-in">
        <p style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 12 }}>Первые 30 сделаны! 🎉</p>
        <p className="muted">Минута отдыха. Дыши как дышится, встряхни руки.</p>
        <div className="big-number" style={{ margin: "24px 0", color: "var(--sky)" }}>{restLeft}</div>
        <button className="btn" onClick={() => { setResting(false); setRestLeft(60); setCount(0); setSet(2); }}>
          Пропустить отдых
        </button>
      </div>
    );
  }

  const done = set_ === 2 && count >= 30;

  return (
    <div className="center">
      <p className="muted" style={{ marginBottom: 6 }}>Подход {set_} из 2</p>
      <div className="big-number" style={{ color: done ? "var(--mint)" : "var(--text)" }}>
        {Math.min(count, 30)}<span style={{ fontSize: "2rem", color: "var(--text-dim)" }}> / 30</span>
      </div>

      {!done ? (
        <>
          <p className="muted" style={{ margin: "14px 0 20px", lineHeight: 1.5 }}>
            Руки над головой, резкий выдох «ХА!» — и рывок локтями вниз.<br />
            После каждого раза жми на кнопку (или жми заранее и делай в такт).
          </p>
          <button className="btn btn-sos" onClick={tap} style={{ fontSize: "1.6rem", padding: "30px 20px" }}>
            Есть!
          </button>
        </>
      ) : (
        <p className="fade-in" style={{ marginTop: 16, fontSize: "1.2rem", fontWeight: 600, color: "var(--mint)" }}>
          60 сбросов! Напряжению просто не на чем держаться. Прислушайся к телу 💙
        </p>
      )}
    </div>
  );
}
