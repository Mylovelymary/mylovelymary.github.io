"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#7cc7f2", "#7fe0c3", "#ffb385", "#b8a7f5", "#f5d76e", "#ff9d9d"];

// Лёгкое конфетти на canvas — салют за победу. Само гаснет за ~3 секунды.
export default function Confetti() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = window.innerWidth * dpr);
    const H = (canvas.height = window.innerHeight * dpr);

    const parts = Array.from({ length: 110 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3,
      y: H * 0.35,
      vx: (Math.random() - 0.5) * 14 * dpr,
      vy: (-6 - Math.random() * 9) * dpr,
      size: (4 + Math.random() * 5) * dpr,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    let frame = 0;
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const fade = Math.max(0, 1 - frame / 180);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25 * dpr;
        p.vx *= 0.99;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      frame++;
      if (frame < 190) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 90 }}
      aria-hidden="true"
    />
  );
}
