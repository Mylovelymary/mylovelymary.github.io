"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EXERCISES, STATES, byId } from "@/data/exercises";
import { useFavorites } from "@/lib/store";
import ExerciseView from "@/components/ExerciseView";
import BackButton from "@/components/BackButton";

// Режим SOS: показываем упражнения по одному.
// «Не помогает» — мгновенно следующее. Любимые — первыми, классика — в самом конце.
// Состояние передаётся через хэш: /sos#panic, /sos#anxiety, /sos#thoughts, /sos#low

function buildDeck(stateId, favs) {
  const matches = (ex) => !stateId || ex.states.includes(stateId);

  const favList = favs.map((id) => byId[id]).filter(Boolean).filter(matches);
  const rest = EXERCISES.filter((ex) => !favs.includes(ex.id) && matches(ex)).sort(
    (a, b) => a.rank - b.rank
  );
  const deck = [...favList, ...rest];
  // Если под состояние ничего не нашлось (не бывает, но на всякий) — показываем всё
  return deck.length ? deck : [...EXERCISES].sort((a, b) => a.rank - b.rank);
}

export default function SosPage() {
  const [stateId, setStateId] = useState(null);
  const [ready, setReady] = useState(false);
  const [idx, setIdx] = useState(0);
  const [helped, setHelped] = useState(false);
  const { favs } = useFavorites();

  // фиксируем избранное на момент входа, чтобы колода не прыгала от нажатий на звезду
  const [initialFavs, setInitialFavs] = useState(null);

  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (STATES.some((s) => s.id === h)) setStateId(h);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && initialFavs === null) setInitialFavs(favs);
  }, [ready, favs, initialFavs]);

  const deck = useMemo(
    () => (initialFavs !== null ? buildDeck(stateId, initialFavs) : []),
    [stateId, initialFavs]
  );

  if (!ready || initialFavs === null) return <main className="container" />;

  if (helped) {
    return (
      <main className="container" style={{ justifyContent: "center" }}>
        <div className="center fade-in">
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>💙</div>
          <h1 className="title" style={{ marginBottom: 12 }}>У тебя получилось.</h1>
          <p className="muted" style={{ marginBottom: 8, lineHeight: 1.6 }}>
            Волна прошла — а ты здесь. Так будет каждый раз.
          </p>
          <p className="dim" style={{ marginBottom: 28 }}>
            Совет: отметь звёздочкой ★ то, что сработало — в следующий раз оно будет первым.
          </p>
          <Link href="/" className="btn btn-mint btn-big" style={{ marginBottom: 10 }}>
            На главную
          </Link>
          <button className="btn" onClick={() => { setHelped(false); }}>
            Мне ещё нужно поупражняться
          </button>
        </div>
      </main>
    );
  }

  if (idx >= deck.length) {
    return (
      <main className="container" style={{ justifyContent: "center" }}>
        <div className="center fade-in">
          <div style={{ fontSize: "3.4rem", marginBottom: 16 }}>🫂</div>
          <h1 className="title" style={{ marginBottom: 12 }}>Всё пройдено — а ты всё ещё здесь.</h1>
          <p className="muted" style={{ marginBottom: 10, lineHeight: 1.6 }}>
            Это само по себе победа: приступ не длится вечно, адреналин уже выгорает.
            Иногда самое сильное — просто переждать волну, зная, что она схлынет.
          </p>
          <p className="muted" style={{ marginBottom: 26, lineHeight: 1.6 }}>
            Если очень тяжело и страшно — позвони на бесплатную линию поддержки,
            там живые люди, которые умеют помогать в такие минуты.
          </p>
          <Link href="/help" className="btn btn-lavender btn-big" style={{ marginBottom: 10 }}>
            Телефоны поддержки
          </Link>
          <button className="btn" onClick={() => setIdx(0)}>
            Пройти по кругу ещё раз
          </button>
          <Link href="/" className="btn-ghost" style={{ marginTop: 10 }}>
            На главную
          </Link>
        </div>
      </main>
    );
  }

  const ex = deck[idx];
  const stateLabel = STATES.find((s) => s.id === stateId)?.label;

  return (
    <main className="container ex-screen">
      <div className="ex-topbar">
        <BackButton label="Выйти" />
        <span className="dim" style={{ fontSize: "0.9rem" }}>
          {stateLabel ? `${stateLabel} · ` : ""}{idx + 1} из {deck.length}
          {initialFavs.includes(ex.id) ? " · ★ из твоей аптечки" : ""}
        </span>
      </div>

      <div className="deck-progress" aria-hidden="true">
        <div style={{ width: `${((idx + 1) / deck.length) * 100}%` }} />
      </div>

      <ExerciseView ex={ex} compact />

      <div className="next-bar">
        <button className="btn btn-helped" style={{ flex: 1 }} onClick={() => setHelped(true)}>
          Помогло 💙
        </button>
        <button className="btn btn-next" style={{ flex: 1.4 }} onClick={() => setIdx((i) => i + 1)}>
          Не то, дальше →
        </button>
      </div>
    </main>
  );
}
