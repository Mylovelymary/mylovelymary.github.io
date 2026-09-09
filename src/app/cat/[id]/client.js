"use client";

import Link from "next/link";
import { EXERCISES, CATEGORIES } from "@/data/exercises";
import { useFavorites } from "@/lib/store";
import BackButton from "@/components/BackButton";
import ExIcon from "@/components/ExIcon";
import ExCard, { TINTS } from "@/components/ExCard";

// Страница раздела: короткое описание и карточки упражнений.
export default function CategoryPageClient({ id }) {
  const { favs, toggle } = useFavorites();
  const cat = CATEGORIES.find((c) => c.id === id);

  if (!cat) {
    return (
      <main className="container" style={{ justifyContent: "center" }}>
        <p className="center muted">Такого раздела нет.</p>
        <Link href="/" className="btn" style={{ marginTop: 16 }}>На главную</Link>
      </main>
    );
  }

  const list = EXERCISES.filter((e) => e.category === cat.id).sort((a, b) => a.rank - b.rank);
  const tint = TINTS[cat.id] || {};

  return (
    <main className="container container-wide">
      <div className="ex-topbar">
        <BackButton />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <span className="title-icon" style={{ background: tint.soft, borderColor: tint.border }}>
          <ExIcon name={cat.icon} size={24} color={tint.icon} />
        </span>
        <h1 className="title" style={{ flex: 1 }}>{cat.label}</h1>
      </div>

      <p className="muted" style={{ marginBottom: 20, lineHeight: 1.5 }}>{cat.hint}</p>

      <div className="card-grid">
        {list.map((ex) => (
          <ExCard key={ex.id} ex={ex} isFav={favs.includes(ex.id)} onStar={toggle} />
        ))}
      </div>

      <div className="next-bar" style={{ marginTop: 24 }}>
        <Link href="/sos" className="btn btn-next" style={{ flex: 1 }}>
          Не знаешь, что выбрать? Подберём за тебя
        </Link>
      </div>
    </main>
  );
}
