"use client";

import Link from "next/link";
import ExIcon from "@/components/ExIcon";
import { Star } from "lucide-react";

// Оттенок карточек по категориям — лёгкая цветовая навигация
export const TINTS = {
  body: { soft: "rgba(255, 179, 133, 0.12)", border: "rgba(255, 179, 133, 0.35)", icon: "#ffb385" },
  mind: { soft: "rgba(124, 199, 242, 0.12)", border: "rgba(124, 199, 242, 0.35)", icon: "#7cc7f2" },
  ground: { soft: "rgba(127, 224, 195, 0.12)", border: "rgba(127, 224, 195, 0.35)", icon: "#7fe0c3" },
  words: { soft: "rgba(184, 167, 245, 0.12)", border: "rgba(184, 167, 245, 0.35)", icon: "#b8a7f5" },
  low: { soft: "rgba(245, 215, 110, 0.1)", border: "rgba(245, 215, 110, 0.32)", icon: "#f5d76e" },
  classic: { soft: "rgba(255, 255, 255, 0.04)", border: "rgba(255, 255, 255, 0.2)", icon: "#aab3c6" },
};

export default function ExCard({ ex, isFav, onStar }) {
  const tint = TINTS[ex.category] || {};
  return (
    <Link
      href={`/ex/${ex.id}/`}
      className={`ex-card ${isFav ? "fav-tint" : ""}`}
      style={{ "--tint-soft": tint.soft, "--tint-border": tint.border }}
    >
      <button
        className={`star-btn ${isFav ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStar(ex.id);
        }}
        aria-label="в мою аптечку"
        title={isFav ? "Убрать из моей аптечки" : "В мою аптечку"}
      >
        <Star size={18} fill={isFav ? "currentColor" : "none"} />
      </button>
      <span className="emoji">
        <ExIcon name={ex.icon} size={22} color={isFav ? "#f5d76e" : tint.icon} />
      </span>
      <span className="name">{ex.title}</span>
      <span className="hint">{ex.hint}</span>
    </Link>
  );
}
