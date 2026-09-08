"use client";

// Мягкие синтезированные звуки через WebAudio — без аудиофайлов, 0 КБ веса.
// Все звуки тихие и округлые: человека в панике нельзя пугать резкими сигналами.
// Выключаются переключателем на главной (localStorage: aptechka.sound = "off").

let ctx = null;

function enabled() {
  try {
    return localStorage.getItem("aptechka.sound") !== "off";
  } catch {
    return true;
  }
}

export function soundEnabled() {
  return enabled();
}

export function setSoundEnabled(on) {
  try {
    localStorage.setItem("aptechka.sound", on ? "on" : "off");
  } catch {
    // приватный режим — просто без сохранения
  }
}

function ensureCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

// Один мягкий тон с плавной атакой и затуханием
function tone(freq, { start = 0, dur = 0.5, vol = 0.08, type = "sine", glideTo = null } = {}) {
  const c = ensureCtx();
  if (!c || !enabled()) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// Нежный «дзынь» окончания таймера — два колокольных тона
export function chime() {
  tone(880, { dur: 0.6, vol: 0.06 });
  tone(1318, { start: 0.12, dur: 0.8, vol: 0.045 });
}

// Тёплый аккорд-поздравление («помогло!»)
export function success() {
  tone(523, { dur: 0.5, vol: 0.05 });
  tone(659, { start: 0.09, dur: 0.5, vol: 0.05 });
  tone(784, { start: 0.18, dur: 0.7, vol: 0.05 });
}

// Мягкий приглушённый «пум» закрывшейся двери + деликатный щелчок замка.
// Никакой резкости: всё через низкий фильтр и плавные огибающие.
function noiseBurst(c, t0, { dur, vol, from, to, hp = false }) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = hp ? "highpass" : "lowpass";
  filter.frequency.setValueAtTime(from, t0);
  filter.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(g).connect(c.destination);
  src.start(t0);
}

export function doorSlam() {
  const c = ensureCtx();
  if (!c || !enabled()) return;
  const t0 = c.currentTime;
  // приглушённый удар подушкой, не хлопок
  noiseBurst(c, t0, { dur: 0.2, vol: 0.28, from: 240, to: 70 });
  // тёплый низкий отклик корпуса
  tone(72, { dur: 0.28, vol: 0.1, glideTo: 48, type: "sine" });
  // мягкий щелчок задвижки — короткий шорох, не писк
  noiseBurst(c, t0 + 0.38, { dur: 0.045, vol: 0.06, from: 1800, to: 900, hp: true });
}

// Лёгкое «пуф» лопнувшего пузыря — каждый раз чуть разной высоты
export function bubblePop() {
  const base = 500 + Math.random() * 400;
  tone(base, { dur: 0.09, vol: 0.05, glideTo: base * 2.2 });
}

// Мягкий тик смены стороны (метроном) — почти неслышный
export function tick() {
  tone(700, { dur: 0.04, vol: 0.025, type: "triangle" });
}
