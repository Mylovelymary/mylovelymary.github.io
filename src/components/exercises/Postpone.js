"use client";

import { useState } from "react";

const OPTIONS = [
  { label: "Через час", phrase: "через час" },
  { label: "Вечером дома", phrase: "вечером, дома, в спокойной обстановке" },
  { label: "В выходные", phrase: "в выходные, когда будет время" },
  { label: "Никогда", phrase: "никогда. Слот занят. Навсегда" },
];

// Договор с паникой о переносе. Абсурдно — но реально срабатывает.
export default function Postpone() {
  const [choice, setChoice] = useState(null);

  return (
    <div className="center">
      {!choice ? (
        <>
          <p style={{ fontSize: "1.15rem", marginBottom: 20, lineHeight: 1.5 }}>
            Скажи панике как назойливому коллеге:<br />
            <b>«Сейчас вообще некогда. Давай перенесём».</b>
          </p>
          <p className="muted" style={{ marginBottom: 16 }}>На когда переносим?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {OPTIONS.map((o) => (
              <button key={o.label} className="btn" onClick={() => setChoice(o)}>
                {o.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="fade-in">
          <div className="deck-card" style={{ cursor: "default", marginBottom: 20 }}>
            📋 Договор подписан.<br />
            Паника перенесена на {choice.phrase}.
          </div>
          <p className="muted" style={{ lineHeight: 1.55 }}>
            Всё, вопрос закрыт — можно возвращаться к делам. Маленький секрет: на
            перенесённую встречу паника почти никогда не приходит. А если придёт —
            ты будешь в удобном месте и во всеоружии.
          </p>
          <button className="btn" style={{ marginTop: 16 }} onClick={() => setChoice(null)}>
            Перенести на другое время
          </button>
        </div>
      )}
    </div>
  );
}
