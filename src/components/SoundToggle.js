"use client";

import { useEffect, useState } from "react";
import { soundEnabled, setSoundEnabled, chime } from "@/lib/sound";

// Переключатель звуков (тихие «дзынь» таймеров, хлопок двери, пузыри).
export default function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(soundEnabled());
  }, []);

  const toggle = () => {
    const next = !on;
    setSoundEnabled(next);
    setOn(next);
    if (next) chime();
  };

  return (
    <button className="chip" onClick={toggle} style={{ margin: "0 auto" }}>
      {on ? "🔊 Звуки включены" : "🔇 Звуки выключены"}
    </button>
  );
}
