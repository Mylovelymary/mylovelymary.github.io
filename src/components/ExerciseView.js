"use client";

import Steps from "@/components/exercises/Steps";
import Deck from "@/components/exercises/Deck";
import Tapping from "@/components/exercises/Tapping";
import Burn from "@/components/exercises/Burn";
import ArmDrop from "@/components/exercises/ArmDrop";
import Emdr from "@/components/exercises/Emdr";
import Door from "@/components/exercises/Door";
import Postpone from "@/components/exercises/Postpone";
import Bubbles from "@/components/exercises/Bubbles";
import SmallSteps from "@/components/exercises/SmallSteps";
import Rule5 from "@/components/exercises/Rule5";
import Muscle from "@/components/exercises/Muscle";
import Breath from "@/components/exercises/Breath";
import Senses from "@/components/exercises/Senses";
import { useFavorites } from "@/lib/store";

function Body({ ex }) {
  switch (ex.type) {
    case "steps": return <Steps steps={ex.steps} />;
    case "phrases": return <Deck cards={ex.cards} allowCustom={ex.id === "phrases"} />;
    case "tapping": return <Tapping />;
    case "burn": return <Burn />;
    case "armdrop": return <ArmDrop />;
    case "emdr": return <Emdr />;
    case "door": return <Door />;
    case "postpone": return <Postpone />;
    case "bubbles": return <Bubbles />;
    case "smallsteps": return <SmallSteps />;
    case "rule5": return <Rule5 />;
    case "muscle": return <Muscle />;
    case "belly": return <Breath mode="belly" />;
    case "breath": return <Breath mode="count" />;
    case "senses": return <Senses />;
    default: return null;
  }
}

export default function ExerciseView({ ex, compact = false }) {
  const { favs, toggle } = useFavorites();
  const isFav = favs.includes(ex.id);

  return (
    <div className="fade-in" key={ex.id}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
        <h1 className="title" style={{ flex: 1 }}>
          {ex.emoji} {ex.title}
        </h1>
        <button
          className={`star-btn ${isFav ? "active" : ""}`}
          style={{ position: "static", flexShrink: 0 }}
          onClick={() => toggle(ex.id)}
          title={isFav ? "Убрать из моей аптечки" : "В мою аптечку"}
          aria-label="избранное"
        >
          {isFav ? "★" : "☆"}
        </button>
      </div>

      {!compact && (
        <p className="muted" style={{ marginBottom: 22, lineHeight: 1.55 }}>
          {ex.intro}
        </p>
      )}
      {compact && (
        <p className="muted" style={{ marginBottom: 18, lineHeight: 1.5, fontSize: "0.98rem" }}>
          {ex.intro}
        </p>
      )}

      <Body ex={ex} />
    </div>
  );
}
