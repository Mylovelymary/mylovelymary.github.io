"use client";

import { useState } from "react";
import { vibrate } from "@/lib/store";

const REPLIES = [
  "Сегодня не принимаю.",
  "Приходи через месяц — может, подумаю.",
  "У меня на тебя нет времени.",
  "Без записи не работаю.",
  "Закрыто. Совсем закрыто.",
];

// Визуализация: закрыть дверь перед паникой, как перед незваной гостьей.
export default function Door() {
  const [closed, setClosed] = useState(false);
  const [times, setTimes] = useState(0);

  const slam = () => {
    vibrate(60);
    setClosed(true);
    setTimes((t) => t + 1);
  };

  return (
    <div className="center">
      <div className="door-scene" style={{ marginBottom: 26 }}>
        <div className="door-frame">{closed ? "" : "🌪️"}</div>
        <div className={`door-panel ${closed ? "closed" : ""}`}>
          <div className="door-knob" />
        </div>
      </div>

      {!closed ? (
        <>
          <p className="muted" style={{ marginBottom: 20 }}>
            Вот она — топчется на пороге. Ты ей ничего не должна.
          </p>
          <button className="btn btn-sos" onClick={slam}>
            Закрыть дверь 🚪
          </button>
        </>
      ) : (
        <div className="fade-in">
          <p style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 8 }}>
            «{REPLIES[(times - 1) % REPLIES.length]}»
          </p>
          <p className="muted" style={{ marginBottom: 20 }}>
            Дверь закрыта. Ты дома, она — снаружи.
          </p>
          <button className="btn" onClick={() => setClosed(false)}>
            Она снова стучится? Закроем ещё раз
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
