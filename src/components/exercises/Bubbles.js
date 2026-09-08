"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { vibrate } from "@/lib/store";
import { bubblePop } from "@/lib/sound";

const COLORS = [
  { name: "голубые", css: "rgba(124, 199, 242, 0.95)" },
  { name: "мятные", css: "rgba(127, 224, 195, 0.95)" },
  { name: "персиковые", css: "rgba(255, 179, 133, 0.95)" },
  { name: "сиреневые", css: "rgba(184, 167, 245, 0.95)" },
];

const PRAISE = ["Отлично! 🎯", "Меткость! ✨", "Так держать! 💫", "Глаз-алмаз! 🌟"];

let uid = 0;

// Игра-переключалка: лопай мыльные пузыри только заданного цвета.
// Пузырей нужного цвета всегда достаточно — никакой охоты за единственным мятным.
export default function Bubbles() {
  const [target, setTarget] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [pops, setPops] = useState([]);
  const [score, setScore] = useState(0);
  const [praise, setPraise] = useState(null);
  const [playing, setPlaying] = useState(false);
  const targetRef = useRef(target);
  targetRef.current = target;

  const spawn = useCallback((forceColor) => {
    const size = 48 + Math.random() * 46;
    return {
      id: uid++,
      color: forceColor != null ? forceColor : Math.floor(Math.random() * COLORS.length),
      x: Math.random() * 78,
      y: Math.random() * 70,
      size,
      delay: Math.random() * 2,
    };
  }, []);

  // Следим, чтобы пузырей нужного цвета всегда было хотя бы три
  const topUp = useCallback(
    (list, tgt) => {
      const next = [...list];
      while (next.filter((b) => b.color === tgt).length < 3) next.push(spawn(tgt));
      return next;
    },
    [spawn]
  );

  const start = () => {
    const tgt = Math.floor(Math.random() * COLORS.length);
    setTarget(tgt);
    setBubbles(topUp(Array.from({ length: 8 }, () => spawn()), tgt));
    setPops([]);
    setScore(0);
    setPraise(null);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setBubbles((bs) => topUp(bs.length < 11 ? [...bs, spawn()] : bs, targetRef.current));
    }, 900);
    return () => clearInterval(t);
  }, [playing, spawn, topUp]);

  const pop = (b) => {
    if (b.color === target) {
      vibrate(20);
      bubblePop();
      const newScore = score + 1;
      setScore(newScore);
      // след от лопнувшего пузыря
      setPops((ps) => [...ps.slice(-6), { id: b.id, x: b.x, y: b.y, size: b.size, color: COLORS[b.color].css }]);
      setTimeout(() => setPops((ps) => ps.filter((p) => p.id !== b.id)), 450);

      let nextTarget = target;
      if (newScore % 7 === 0) {
        nextTarget = (target + 1 + Math.floor(Math.random() * (COLORS.length - 1))) % COLORS.length;
        setTarget(nextTarget);
        setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
        setTimeout(() => setPraise(null), 1200);
      }
      setBubbles((bs) => topUp(bs.filter((x) => x.id !== b.id).concat(spawn()), nextTarget));
    } else {
      // не тот цвет — пузырь упруго вздрагивает
      setBubbles((bs) => bs.map((x) => (x.id === b.id ? { ...x, wrong: (x.wrong || 0) + 1 } : x)));
    }
  };

  if (!playing) {
    return (
      <div className="center">
        <div style={{ fontSize: "3.4rem", marginBottom: 14 }}>🫧</div>
        <p className="muted" style={{ marginBottom: 20 }}>
          Лопай только пузыри нужного цвета. Цвет со временем меняется — следи за подсказкой.
        </p>
        <button className="btn btn-sky btn-big" onClick={start}>
          Играть
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
          Лопай{" "}
          <span
            style={{
              color: COLORS[target].css,
              textShadow: "0 0 16px " + COLORS[target].css,
              transition: "color 0.3s ease",
            }}
          >
            {COLORS[target].name}
          </span>
        </span>
        <span className="muted">{praise || `Счёт: ${score}`}</span>
      </div>

      <div className="bubble-area">
        {pops.map((p) => (
          <span
            key={`pop-${p.id}`}
            className="bubble-pop"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, "--bubble-color": p.color }}
          />
        ))}
        {bubbles.map((b) => (
          <button
            key={b.id}
            className={`bubble ${b.wrong ? "bubble-wrong" : ""}`}
            // key для перезапуска анимации вздрагивания
            data-wrong={b.wrong || 0}
            onClick={() => pop(b)}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              animationDelay: `0s, ${b.delay}s`,
              "--bubble-color": COLORS[b.color].css,
            }}
            aria-label="пузырь"
          >
            <span className="skin" />
          </button>
        ))}
      </div>

      <button className="btn-ghost" style={{ margin: "10px auto 0", display: "block" }} onClick={() => setPlaying(false)}>
        Хватит играть
      </button>
    </div>
  );
}
