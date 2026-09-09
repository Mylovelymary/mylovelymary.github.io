"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Переключатель темы. По умолчанию — светлая (тёмная многих угнетает
// в остром состоянии), выбор хранится на устройстве.
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      setDark(localStorage.getItem("aptechka.theme") === "dark");
    } catch {
      // приватный режим — работаем со светлой
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem("aptechka.theme", next ? "dark" : "light");
    } catch {
      // без сохранения
    }
  };

  return (
    <button className="chip" onClick={toggle}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
      {dark ? "Светлая тема" : "Тёмная тема"}
    </button>
  );
}
