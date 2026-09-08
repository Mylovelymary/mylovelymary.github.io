"use client";

import Link from "next/link";
import { EXERCISES, byId } from "@/data/exercises";
import { useFavorites } from "@/lib/store";
import BackButton from "@/components/BackButton";
import ExIcon from "@/components/ExIcon";
import { Star, ChevronUp, ChevronDown } from "lucide-react";

// Конструктор личной аптечки: порядок любимых упражнений.
// Этот порядок используется в режиме SOS — любимые показываются первыми.
export default function MyKitPage() {
  const { favs, toggle, move } = useFavorites();
  const favExercises = favs.map((id) => byId[id]).filter(Boolean);
  const others = EXERCISES.filter((e) => !favs.includes(e.id)).sort((a, b) => a.rank - b.rank);

  const iconCell = (ex, active) => (
    <span style={{ width: 34, flexShrink: 0, display: "flex", justifyContent: "center", color: active ? "var(--gold)" : "var(--sky)" }}>
      <ExIcon name={ex.icon} size={22} />
    </span>
  );

  return (
    <main className="container">
      <div className="ex-topbar">
        <BackButton />
      </div>

      <h1 className="title" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <Star size={26} fill="var(--gold)" color="var(--gold)" /> Моя аптечка
      </h1>
      <p className="muted" style={{ marginBottom: 6, lineHeight: 1.5 }}>
        Собери программу под себя: что наверху — то в режиме SOS покажется первым.
      </p>
      <p className="dim" style={{ fontSize: "0.88rem", marginBottom: 22 }}>
        Всё хранится только на этом устройстве, никуда не отправляется.
      </p>

      {favExercises.length === 0 && (
        <div className="panel center" style={{ marginBottom: 24 }}>
          <p className="muted">
            Пока пусто. Добавь из списка ниже то, что тебе помогает ⭐
          </p>
        </div>
      )}

      {favExercises.map((ex, i) => (
        <div key={ex.id} className="step-item" style={{ cursor: "default", alignItems: "center" }}>
          {iconCell(ex, true)}
          <Link href={`/ex/${ex.id}/`} style={{ flex: 1, color: "var(--text)", textDecoration: "none", fontWeight: 600 }}>
            {ex.title}
          </Link>
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            <button className="btn-ghost" style={{ padding: "6px 10px" }} disabled={i === 0} onClick={() => move(ex.id, -1)} aria-label="выше">
              <ChevronUp size={19} />
            </button>
            <button className="btn-ghost" style={{ padding: "6px 10px" }} disabled={i === favExercises.length - 1} onClick={() => move(ex.id, 1)} aria-label="ниже">
              <ChevronDown size={19} />
            </button>
            <button className="btn-ghost" style={{ padding: "6px 10px", color: "var(--gold)" }} onClick={() => toggle(ex.id)} aria-label="убрать">
              <Star size={18} fill="currentColor" />
            </button>
          </div>
        </div>
      ))}

      <div className="section-label">Добавить в аптечку</div>
      {others.map((ex) => (
        <div key={ex.id} className="step-item" style={{ cursor: "default", alignItems: "center" }}>
          {iconCell(ex, false)}
          <Link href={`/ex/${ex.id}/`} style={{ flex: 1, color: "var(--text)", textDecoration: "none" }}>
            <div style={{ fontWeight: 600 }}>{ex.title}</div>
            <div className="dim" style={{ fontSize: "0.85rem" }}>{ex.hint}</div>
          </Link>
          <button className="btn-ghost" style={{ padding: "6px 12px", flexShrink: 0 }} onClick={() => toggle(ex.id)} aria-label="добавить">
            <Star size={18} />
          </button>
        </div>
      ))}
    </main>
  );
}
