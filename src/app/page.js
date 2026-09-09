"use client";

import Link from "next/link";
import { EXERCISES, CATEGORIES, STATES, byId } from "@/data/exercises";
import { useFavorites } from "@/lib/store";
import Raccoon from "@/components/Raccoon";
import SoundToggle from "@/components/SoundToggle";
import ThemeToggle from "@/components/ThemeToggle";
import ExIcon from "@/components/ExIcon";
import ExCard, { TINTS } from "@/components/ExCard";
import { Star, Phone, Smartphone } from "lucide-react";

// «2 способа», но «5 способов»
function waysWord(n) {
  const d10 = n % 10, d100 = n % 100;
  if (d10 === 1 && d100 !== 11) return "способ";
  if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return "способа";
  return "способов";
}

const STATE_TINTS = {
  panic: { soft: "rgba(255, 158, 109, 0.14)", border: "rgba(255, 158, 109, 0.4)", icon: "#ffb385" },
  anxiety: { soft: "rgba(124, 199, 242, 0.13)", border: "rgba(124, 199, 242, 0.38)", icon: "#7cc7f2" },
  thoughts: { soft: "rgba(184, 167, 245, 0.13)", border: "rgba(184, 167, 245, 0.38)", icon: "#b8a7f5" },
  low: { soft: "rgba(245, 215, 110, 0.11)", border: "rgba(245, 215, 110, 0.35)", icon: "#f5d76e" },
};

export default function Home() {
  const { favs, toggle } = useFavorites();
  const favExercises = favs.map((id) => byId[id]).filter(Boolean);

  return (
    <main className="container container-wide">
      <header className="center" style={{ margin: "22px 0 6px" }}>
        <Raccoon size={125} />
        <h1 className="title title-hero" style={{ marginTop: 4 }}>Аптечка</h1>
        <p className="subtitle" style={{ marginTop: 8 }}>
          Помощь при панике и тревоге. С тобой Хагси.
        </p>
      </header>

      <div style={{ margin: "24px 0 12px" }}>
        <Link href="/sos" className="btn btn-sos sos-big">
          <span className="sos-line1">
            <span className="sos-pulse" aria-hidden="true" />
            Тебе плохо?
          </span>
          <span className="sos-line2">Жми сюда — поможем прямо сейчас</span>
        </Link>
      </div>

      <div className="state-grid" style={{ marginBottom: 8 }}>
        {STATES.map((s) => {
          const tint = STATE_TINTS[s.id] || {};
          return (
            <Link
              key={s.id}
              href={`/sos#${s.id}`}
              className="state-card"
              style={{ "--tint-soft": tint.soft, "--tint-border": tint.border }}
            >
              <span className="emoji">
                <ExIcon name={s.icon} size={20} color={tint.icon} />
              </span>
              {s.label}
            </Link>
          );
        })}
      </div>

      {favExercises.length > 0 && (
        <>
          <div className="section-label" style={{ color: "var(--gold)", gap: 8 }}>
            <Star size={14} fill="currentColor" /> Моя аптечка
          </div>
          <div className="card-grid">
            {favExercises.map((ex) => (
              <ExCard key={ex.id} ex={ex} isFav onStar={toggle} />
            ))}
          </div>
          <Link href="/my" className="btn-ghost" style={{ margin: "10px auto 0", display: "block", width: "fit-content" }}>
            Настроить порядок моей аптечки
          </Link>
        </>
      )}

      {favExercises.length === 0 && (
        <div className="panel" style={{ marginTop: 26, padding: "18px 20px", display: "flex", gap: 14 }}>
          <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }}>
            <Star size={22} fill="currentColor" />
          </span>
          <p className="muted" style={{ fontSize: "1rem", lineHeight: 1.55 }}>
            Жми звёздочку на том, что помогает, — соберётся <b>твоя личная аптечка</b>.
          </p>
        </div>
      )}

      <div className="section-label">Все способы — по разделам</div>
      <div className="cat-grid">
        {CATEGORIES.map((cat) => {
          const count = EXERCISES.filter((e) => e.category === cat.id).length;
          const tint = TINTS[cat.id] || {};
          return (
            <Link
              key={cat.id}
              href={`/cat/${cat.id}/`}
              className="cat-card"
              style={{ "--tint-soft": tint.soft, "--tint-border": tint.border }}
            >
              <span className="emoji">
                <ExIcon name={cat.icon} size={26} color={tint.icon} />
              </span>
              <span className="name">{cat.short}</span>
              <span className="hint">{count} {waysWord(count)}</span>
            </Link>
          );
        })}
      </div>

      <hr className="sep" />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/help" className="btn btn-lavender">
          <Phone size={19} /> Бесплатные телефоны поддержки
        </Link>
        <Link href="/install" className="btn">
          <Smartphone size={19} /> Установить на телефон — работает без интернета
        </Link>
      </div>

      <div className="chip-row" style={{ justifyContent: "center", marginTop: 18 }}>
        <SoundToggle />
        <ThemeToggle />
      </div>

      <p className="dim center" style={{ fontSize: "0.8rem", marginTop: 20, lineHeight: 1.5 }}>
        Бесплатно, без регистрации, работает офлайн. Упражнения собраны из опыта людей,
        которые сами прошли через панические атаки. Аптечка помогает пережить острый момент,
        но не заменяет психотерапию и врача. Ты в этом не в одиночестве. 💙
      </p>
    </main>
  );
}
