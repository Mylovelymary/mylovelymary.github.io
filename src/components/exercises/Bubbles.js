"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { vibrate } from "@/lib/store";
import { bubblePop } from "@/lib/sound";

// css — цвет плёнки пузыря (пастельный в обеих темах),
// label — цвет слова-подсказки, зависит от темы, чтобы читалось
const COLORS = [
  { name: "голубые", css: "rgba(124, 199, 242, 0.95)", label: "var(--sky)" },
  { name: "мятные", css: "rgba(127, 224, 195, 0.95)", label: "var(--mint)" },
  { name: "персиковые", css: "rgba(255, 179, 133, 0.95)", label: "var(--peach)" },
  { name: "сиреневые", css: "rgba(184, 167, 245, 0.95)", label: "var(--lavender)" },
];

const PRAISE = ["Отлично! 🎯", "Меткость! ✨", "Так держать! 💫", "Глаз-алмаз! 🌟"];
const COUNT = 11; // пузырей на экране одновременно

let uid = 0;

// Игра-переключалка на плавной физике: пузыри всплывают со дна и покачиваются,
// лопай только пузыри нужного цвета. Нужного цвета на экране всегда минимум три.
export default function Bubbles() {
  const [playing, setPlaying] = useState(false);
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [praise, setPraise] = useState(null);
  const [pops, setPops] = useState([]);
  const [, force] = useReducer((x) => x + 1, 0);

  const areaRef = useRef(null);
  const bubblesRef = useRef([]);
  const nodesRef = useRef(new Map());
  const targetRef = useRef(0);
  targetRef.current = target;

  const makeBubble = useCallback((color, startAtBottom) => {
    const area = areaRef.current;
    const w = area ? area.clientWidth : 340;
    const h = area ? area.clientHeight : 420;
    const size = 46 + Math.random() * 42;
    return {
      id: uid++,
      color: color != null ? color : Math.floor(Math.random() * COLORS.length),
      baseX: 8 + Math.random() * (w - size - 16),
      y: startAtBottom ? h + size + Math.random() * h * 0.5 : Math.random() * (h - size),
      size,
      speed: 0.25 + Math.random() * 0.45,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.008 + Math.random() * 0.012,
      wobbleAmp: 6 + Math.random() * 8,
    };
  }, []);

  // добираем пузыри так, чтобы целевого цвета всегда было минимум три
  const topUp = useCallback(
    (tgt, startAtBottom = true) => {
      const list = bubblesRef.current;
      while (list.length < COUNT) list.push(makeBubble(null, startAtBottom));
      let need = 3 - list.filter((b) => b.color === tgt).length;
      for (let i = list.length - 1; need > 0 && i >= 0; i--) {
        if (list[i].color !== tgt) {
          list[i] = makeBubble(tgt, startAtBottom);
          need--;
        }
      }
    },
    [makeBubble]
  );

  const start = () => {
    const tgt = Math.floor(Math.random() * COLORS.length);
    bubblesRef.current = [];
    setTarget(tgt);
    setScore(0);
    setPraise(null);
    setPops([]);
    setPlaying(true);
  };

  // первичное наполнение — после того как область отрендерилась
  useEffect(() => {
    if (!playing) return;
    topUp(targetRef.current, false);
    force();
  }, [playing, topUp]);

  // физика: пузыри плывут вверх и покачиваются
  useEffect(() => {
    if (!playing) return;
    let raf;
    const step = () => {
      const area = areaRef.current;
      if (area) {
        const h = area.clientHeight;
        for (const b of bubblesRef.current) {
          b.y -= b.speed;
          b.wobble += b.wobbleSpeed;
          if (b.y < -b.size) {
            // уплыл — возрождается снизу, сохраняя гарантию целевого цвета
            const idx = bubblesRef.current.indexOf(b);
            bubblesRef.current[idx] = makeBubble(
              bubblesRef.current.filter((x) => x.color === targetRef.current && x !== b).length < 3
                ? targetRef.current
                : null,
              true
            );
            bubblesRef.current[idx].y = h + bubblesRef.current[idx].size;
            force();
            continue;
          }
          const node = nodesRef.current.get(b.id);
          if (node) {
            const x = b.baseX + Math.sin(b.wobble) * b.wobbleAmp;
            node.style.transform = `translate(${x}px, ${b.y}px)`;
          }
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, makeBubble]);

  const pop = (b) => {
    if (b.color === target) {
      vibrate(20);
      bubblePop();
      const newScore = score + 1;
      setScore(newScore);

      const node = nodesRef.current.get(b.id);
      const x = node ? b.baseX + Math.sin(b.wobble) * b.wobbleAmp : b.baseX;
      setPops((ps) => [...ps.slice(-6), { id: b.id, x, y: b.y, size: b.size, color: COLORS[b.color].css }]);
      setTimeout(() => setPops((ps) => ps.filter((p) => p.id !== b.id)), 450);

      let nextTarget = target;
      if (newScore % 7 === 0) {
        nextTarget = (target + 1 + Math.floor(Math.random() * (COLORS.length - 1))) % COLORS.length;
        setTarget(nextTarget);
        setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
        setTimeout(() => setPraise(null), 1200);
      }
      bubblesRef.current = bubblesRef.current.filter((x2) => x2.id !== b.id);
      topUp(nextTarget);
      force();
    } else {
      // не тот цвет — пузырь упруго вздрагивает
      const node = nodesRef.current.get(b.id);
      if (node) {
        node.classList.remove("bubble-wrong");
        void node.offsetWidth; // перезапуск анимации
        node.classList.add("bubble-wrong");
      }
    }
  };

  if (!playing) {
    return (
      <div className="center">
        <div style={{ fontSize: "3.4rem", marginBottom: 14 }}>🫧</div>
        <p className="muted" style={{ marginBottom: 20 }}>
          Пузыри всплывают со дна — лопай только пузыри нужного цвета. Цвет со временем меняется, следи за подсказкой.
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
          <span style={{ color: COLORS[target].label, fontWeight: 800, transition: "color 0.3s ease" }}>
            {COLORS[target].name}
          </span>
        </span>
        <span className="muted">{praise || `Счёт: ${score}`}</span>
      </div>

      <div className="bubble-area" ref={areaRef}>
        {pops.map((p) => (
          <span
            key={`pop-${p.id}`}
            className="bubble-pop"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size, "--bubble-color": p.color }}
          />
        ))}
        {bubblesRef.current.map((b) => (
          <button
            key={b.id}
            ref={(el) => {
              if (el) nodesRef.current.set(b.id, el);
              else nodesRef.current.delete(b.id);
            }}
            className="bubble"
            onPointerDown={() => pop(b)}
            style={{
              left: 0,
              top: 0,
              width: b.size,
              height: b.size,
              transform: `translate(${b.baseX}px, ${b.y}px)`,
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
