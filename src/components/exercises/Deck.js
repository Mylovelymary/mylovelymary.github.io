"use client";

import { useState } from "react";
import { useCustomPhrases } from "@/lib/store";

// Колода карточек с фразами. Для упражнения "phrases" можно добавлять свои.
export default function Deck({ cards, allowCustom = false }) {
  const { phrases, add, remove } = useCustomPhrases();
  const all = allowCustom ? [...phrases, ...cards] : cards;

  const [idx, setIdx] = useState(0);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");

  const next = () => setIdx((i) => (i + 1) % all.length);
  const current = all[idx % all.length];
  const isCustom = allowCustom && phrases.includes(current);

  const submit = () => {
    if (text.trim()) {
      add(text);
      setIdx(0);
      setText("");
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="deck-card" onClick={next} title="Нажми для следующей">
        {current}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button className="btn" onClick={next}>
          Следующая
        </button>
      </div>

      {isCustom && (
        <button
          className="btn-ghost"
          style={{ margin: "8px auto 0", display: "block" }}
          onClick={() => {
            remove(current);
            setIdx(0);
          }}
        >
          Удалить эту мою фразу
        </button>
      )}

      {allowCustom && !adding && (
        <button
          className="btn btn-lavender"
          style={{ marginTop: 10 }}
          onClick={() => setAdding(true)}
        >
          ＋ Добавить свою фразу
        </button>
      )}

      {allowCustom && adding && (
        <div className="fade-in" style={{ marginTop: 14 }}>
          <textarea
            className="text-input"
            rows={2}
            placeholder="Фраза, которая помогает именно тебе…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn btn-mint" onClick={submit}>
              Сохранить
            </button>
            <button className="btn" onClick={() => setAdding(false)}>
              Отмена
            </button>
          </div>
          <p className="dim" style={{ fontSize: "0.85rem", marginTop: 8 }}>
            Твои фразы показываются первыми и хранятся только на этом устройстве.
          </p>
        </div>
      )}
    </div>
  );
}
