// Сервис-воркер Аптечки: офлайн-режим.
// Стратегия: HTML-страницы — сеть, при недоступности кэш; статика — кэш, обновление в фоне.
// При каждой установке предзагружаются все страницы, чтобы офлайн работал целиком.

const VERSION = "aptechka-v1";

const EXERCISES = [
  "tapping", "squats", "cold", "sour", "armdrop", "walk", "sing",
  "emdr", "door", "postpone", "bubbles", "laugh",
  "grounding", "water", "hug", "mirror", "cry",
  "phrases", "notdanger",
  "smallsteps", "rule5", "kind",
  "muscle", "belly", "breath", "senses54321",
];

const PRECACHE = [
  "/",
  "/sos/",
  "/my/",
  "/help/",
  "/install/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  ...EXERCISES.map((id) => `/ex/${id}/`),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then(async (cache) => {
      // Кэшируем по одному, чтобы одна недоступная страница не сорвала всю установку
      await Promise.allSettled(PRECACHE.map((url) => cache.add(url)));
      self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Навигация по страницам: сеть → кэш → главная
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
          return resp;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // Статика (_next, иконки и т.п.): кэш сразу, обновление в фоне
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((resp) => {
          if (resp.ok) {
            const copy = resp.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
