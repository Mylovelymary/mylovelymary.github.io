"use client";

import { useSyncExternalStore, useCallback } from "react";

// Все данные пользователя живут только в localStorage на его устройстве.
// Никаких аккаунтов, серверов и регистраций.

const KEYS = {
  favs: "aptechka.favs",
  phrases: "aptechka.phrases",
};

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // приватный режим/переполнение — просто работаем без сохранения
  }
  listeners.forEach((l) => l());
}

const listeners = new Set();
function subscribe(cb) {
  listeners.add(cb);
  const onStorage = () => cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

// Кэшируем снапшоты, чтобы useSyncExternalStore не зацикливался
let favsCache = null;
let favsCacheRaw = null;
function favsSnapshot() {
  if (typeof window === "undefined") return EMPTY;
  let raw;
  try {
    raw = localStorage.getItem(KEYS.favs);
  } catch {
    return EMPTY;
  }
  if (raw !== favsCacheRaw) {
    favsCacheRaw = raw;
    try {
      favsCache = raw ? JSON.parse(raw) : [];
    } catch {
      favsCache = [];
    }
  }
  return favsCache || EMPTY;
}
const EMPTY = [];
const emptySnapshot = () => EMPTY;

export function useFavorites() {
  const favs = useSyncExternalStore(subscribe, favsSnapshot, emptySnapshot);

  const toggle = useCallback((id) => {
    const cur = read(KEYS.favs, []);
    write(
      KEYS.favs,
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  }, []);

  const move = useCallback((id, dir) => {
    const cur = [...read(KEYS.favs, [])];
    const i = cur.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= cur.length) return;
    [cur[i], cur[j]] = [cur[j], cur[i]];
    write(KEYS.favs, cur);
  }, []);

  return { favs, toggle, move };
}

let phrasesCache = null;
let phrasesCacheRaw = null;
function phrasesSnapshot() {
  if (typeof window === "undefined") return EMPTY;
  let raw;
  try {
    raw = localStorage.getItem(KEYS.phrases);
  } catch {
    return EMPTY;
  }
  if (raw !== phrasesCacheRaw) {
    phrasesCacheRaw = raw;
    try {
      phrasesCache = raw ? JSON.parse(raw) : [];
    } catch {
      phrasesCache = [];
    }
  }
  return phrasesCache || EMPTY;
}

export function useCustomPhrases() {
  const phrases = useSyncExternalStore(subscribe, phrasesSnapshot, emptySnapshot);

  const add = useCallback((text) => {
    const t = text.trim();
    if (!t) return;
    const cur = read(KEYS.phrases, []);
    if (!cur.includes(t)) write(KEYS.phrases, [t, ...cur]);
  }, []);

  const remove = useCallback((text) => {
    write(KEYS.phrases, read(KEYS.phrases, []).filter((p) => p !== text));
  }, []);

  return { phrases, add, remove };
}

export function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    // не поддерживается — и ладно
  }
}
