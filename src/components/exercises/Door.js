"use client";

import { useState } from "react";
import { vibrate } from "@/lib/store";
import { doorSlam } from "@/lib/sound";

const REPLIES = [
  "Сегодня не принимаю.",
  "Приходи через месяц — может, подумаю.",
  "У меня на тебя нет времени.",
  "Без записи не работаю.",
  "Закрыто. Совсем закрыто.",
];

// Визуализация: захлопнуть дверь перед паникой, как перед незваной гостьей.
export default function Door() {
  const [closed, setClosed] = useState(false);
  const [times, setTimes] = useState(0);

  const slam = () => {
    vibrate([40, 60, 90]);
    doorSlam();
    setClosed(true);
    setTimes((t) => t + 1);
  };

  return (
    <div className="center">
      <div className="door-scene" style={{ marginBottom: 34 }}>
        <div className="door-frame">
          {!closed && (
            <div className="panic-vortex">
              <div className="vortex-core" />
            </div>
          )}
        </div>
        <div className={`door-panel ${closed ? "closed slam" : ""}`}>
          <div className="door-knob" />
          {closed && <div className="door-lock" />}
        </div>
        <div className="door-shadow" />
      </div>

      {!closed ? (
        <>
          <p className="muted" style={{ marginBottom: 20 }}>
            Вот она — клубится на пороге. Впускать её совсем не обязательно.
          </p>
          <button className="btn btn-sos" onClick={slam}>
            Захлопнуть дверь
          </button>
        </>
      ) : (
        <div className="fade-in">
          <p style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 8, fontFamily: "var(--font-head)" }}>
            «{REPLIES[(times - 1) % REPLIES.length]}»
          </p>
          <p className="muted" style={{ marginBottom: 20 }}>
            Хлоп. Замок щёлкнул. Ты дома, она — снаружи.
          </p>
          <button className="btn" onClick={() => setClosed(false)}>
            Она снова стучится? Захлопнем ещё раз
          </button>
        </div>
      )}

      <p className="dim" style={{ marginTop: 24, fontSize: "0.92rem", lineHeight: 1.5 }}>
        Одна женщина, справившаяся с ПА, месяцами мысленно закрывала эту дверь:
        «приходи через месяц». Через месяц никто так и не пришёл.
      </p>
    </div>
  );
}
