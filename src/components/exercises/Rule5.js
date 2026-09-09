"use client";

import { useEffect, useState } from "react";
import { RULE5_IDEAS } from "@/data/exercises";
import { vibrate } from "@/lib/store";
import { chime } from "@/lib/sound";
import { Flag } from "lucide-react";

// Правило 5 минут: выбрать простое дело руками + договор с собой + таймер.
export default function Rule5() {
  const [left, setLeft] = useState(300);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      setFinished(true);
      vibrate([120, 90, 120]);
      chime();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left]);

  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="center">
      {!finished ? (
        <>
          <div className="big-number" style={{ margin: "10px 0" }}>
            {mm}:{ss}
          </div>
          {!running ? (
            <>
              <p className="muted" style={{ margin: "10px 0 14px", lineHeight: 1.55 }}>
                Выбери <b>простое дело руками</b> — голове нужно занятое тело.
                Уговор такой: делаешь его всего 5 минут.<br />
                Прозвенит таймер — имеешь полное право бросить.
              </p>
              <div className="chip-row" style={{ justifyContent: "center", marginBottom: 20 }}>
                {RULE5_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    className={`chip ${task === idea ? "selected" : ""}`}
                    onClick={() => setTask(task === idea ? null : idea)}
                  >
                    {idea}
                  </button>
                ))}
              </div>
              <button className="btn btn-mint btn-big" onClick={() => setRunning(true)}>
                Договорились, запускай
              </button>
              <p className="dim" style={{ marginTop: 16, fontSize: "0.9rem" }}>
                Своё дело тоже подходит — лишь бы руками, а не в телефоне.
              </p>
            </>
          ) : (
            <>
              <p className="muted" style={{ margin: "10px 0 20px" }}>
                {task ? `Дело: ${task}. ` : ""}Идёт время уговора. Просто делай — красиво не обязательно.
              </p>
              <button className="btn" onClick={() => setRunning(false)}>
                Пауза
              </button>
            </>
          )}
        </>
      ) : (
        <div className="fade-in">
          <div style={{ color: "var(--mint)", display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Flag size={48} strokeWidth={1.7} aria-hidden="true" />
          </div>
          <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 10 }}>
            5 минут — есть! Уговор выполнен.
          </p>
          <p className="muted" style={{ marginBottom: 20 }}>
            Хочешь — бросай с чистой совестью. А если втянет — продолжай, это тоже победа.
          </p>
          <button
            className="btn btn-mint"
            onClick={() => {
              setLeft(300);
              setFinished(false);
              setRunning(true);
            }}
          >
            Ещё 5 минут
          </button>
        </div>
      )}
    </div>
  );
}
