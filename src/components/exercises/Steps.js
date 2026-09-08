"use client";

import { useState } from "react";

export default function Steps({ steps, doneText = "Готово. Ты молодец 💙" }) {
  const [done, setDone] = useState([]);

  const toggle = (i) =>
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  const complete = done.length === steps.length;

  return (
    <div>
      {steps.map((s, i) => (
        <div
          key={i}
          className={`step-item ${done.includes(i) ? "done" : ""}`}
          onClick={() => toggle(i)}
        >
          <div className="step-check">{done.includes(i) ? "✓" : ""}</div>
          <div>
            <span style={{ marginRight: 8 }}>{s.icon}</span>
            {s.text}
          </div>
        </div>
      ))}
      {complete && (
        <p className="center fade-in" style={{ marginTop: 18, fontSize: "1.15rem", fontWeight: 600, color: "var(--mint)" }}>
          {doneText}
        </p>
      )}
    </div>
  );
}
