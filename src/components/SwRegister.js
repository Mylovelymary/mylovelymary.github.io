"use client";

import { useEffect } from "react";

// Регистрирует сервис-воркер, который делает Аптечку доступной без интернета.
export default function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // офлайн-режим не критичен для работы сайта
      });
    }
  }, []);
  return null;
}
