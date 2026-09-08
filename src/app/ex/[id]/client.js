"use client";

import Link from "next/link";
import { byId } from "@/data/exercises";
import ExerciseView from "@/components/ExerciseView";

export default function ExercisePageClient({ id }) {
  const ex = byId[id];
  if (!ex) {
    return (
      <main className="container" style={{ justifyContent: "center" }}>
        <p className="center muted">Такого упражнения нет.</p>
        <Link href="/" className="btn" style={{ marginTop: 16 }}>На главную</Link>
      </main>
    );
  }

  return (
    <main className="container ex-screen">
      <div className="ex-topbar">
        <Link href="/" className="btn-ghost">← Назад</Link>
      </div>

      <ExerciseView ex={ex} />

      <div className="next-bar">
        <Link href="/sos" className="btn btn-next" style={{ flex: 1 }}>
          Не помогает — подбери мне другое →
        </Link>
      </div>
    </main>
  );
}
