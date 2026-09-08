"use client";

import Link from "next/link";
import { EXERCISES, CATEGORIES, STATES, byId } from "@/data/exercises";
import { useFavorites } from "@/lib/store";

function Card({ ex, isFav, onStar }) {
  return (
    <Link href={`/ex/${ex.id}/`} className={`ex-card ${isFav ? "fav-tint" : ""}`}>
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
        {isFav ? "★" : "☆"}
      </button>
      <span className="emoji">{ex.emoji}</span>
      <span className="name">{ex.title}</span>
      <span className="hint">{ex.hint}</span>
    </Link>
  );
}

export default function Home() {
  const { favs, toggle } = useFavorites();
  const favExercises = favs.map((id) => byId[id]).filter(Boolean);

  return (
    <main className="container container-wide">
      <header className="center" style={{ margin: "26px 0 6px" }}>
        <h1 className="title">Аптечка 💙</h1>
        <p className="subtitle" style={{ marginTop: 6 }}>
          Скорая помощь при панике, тревоге и тяжёлых днях
        </p>
        <p className="dim" style={{ fontSize: "0.85rem", marginTop: 6 }}>
          Бесплатно · без регистрации · работает без интернета
        </p>
      </header>

      <div style={{ margin: "24px 0 10px" }}>
        <Link href="/sos" className="btn btn-sos">
          🆘 Мне плохо прямо сейчас
        </Link>
      </div>

      <div className="chip-row" style={{ justifyContent: "center", marginBottom: 6 }}>
        {STATES.map((s) => (
          <Link key={s.id} href={`/sos#${s.id}`} className="chip">
            {s.emoji} {s.label}
          </Link>
        ))}
      </div>
      <p className="dim center" style={{ fontSize: "0.85rem" }}>
        В режиме SOS упражнения идут по одному: не подходит — жми «дальше», пока не найдёшь своё.
      </p>

      {favExercises.length > 0 && (
        <>
          <div className="section-label" style={{ color: "var(--gold)" }}>
            ★ Моя аптечка
          </div>
          <div className="card-grid">
            {favExercises.map((ex) => (
              <Card key={ex.id} ex={ex} isFav onStar={toggle} />
            ))}
          </div>
          <Link href="/my" className="btn-ghost" style={{ margin: "10px auto 0", display: "block", width: "fit-content" }}>
            Настроить порядок моей аптечки →
          </Link>
        </>
      )}

      {favExercises.length === 0 && (
        <div className="panel" style={{ marginTop: 26, padding: "18px 20px" }}>
          <p className="muted" style={{ fontSize: "0.95rem", lineHeight: 1.55 }}>
            ⭐ Нажимай звёздочку на упражнениях, которые тебе помогают, — они соберутся
            в <b>твою личную аптечку</b> и в трудный момент будут показываться первыми.
            Всё хранится только на этом устройстве.
          </p>
        </div>
      )}

      {CATEGORIES.map((cat) => {
        const list = EXERCISES.filter((e) => e.category === cat.id).sort((a, b) => a.rank - b.rank);
        if (!list.length) return null;
        return (
          <section key={cat.id}>
            <div className="section-label">{cat.label}</div>
            <p className="dim" style={{ fontSize: "0.88rem", margin: "-6px 0 12px" }}>{cat.hint}</p>
            <div className="card-grid">
              {list.map((ex) => (
                <Card key={ex.id} ex={ex} isFav={favs.includes(ex.id)} onStar={toggle} />
              ))}
            </div>
          </section>
        );
      })}

      <hr className="sep" />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/help" className="btn btn-lavender">
          ☎️ Бесплатные телефоны поддержки
        </Link>
        <Link href="/install" className="btn">
          📲 Установить на телефон и пользоваться без интернета
        </Link>
      </div>

      <p className="dim center" style={{ fontSize: "0.8rem", marginTop: 26, lineHeight: 1.5 }}>
        Упражнения собраны из опыта людей, которые сами прошли через панические атаки.
        Аптечка помогает пережить острый момент, но не заменяет психотерапию и врача.
        Если приступы частые — пожалуйста, обратись к специалисту. Ты не одна. 💙
      </p>
    </main>
  );
}
