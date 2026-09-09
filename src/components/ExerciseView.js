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
import ExIcon from "@/components/ExIcon";
import Raccoon from "@/components/Raccoon";
import { useFavorites } from "@/lib/store";
import { Star } from "lucide-react";

// Хагси показывает и «предметные» упражнения: дрожит с льдинкой,
// держит стакан, поёт с микрофоном, обнимает сердечко
const MASCOT = {
  cold: { pose: "shiver", item: "ice" },
  water: { pose: "calm", item: "glass" },
  sing: { pose: "groove", item: "mic" },
  hug: { pose: "hug", item: "heart" },
};

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
    <div className={compact ? "slide-in" : "fade-in"} key={ex.id}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <span className="title-icon">
          <ExIcon name={ex.icon} size={24} />
        </span>
        <h1 className="title" style={{ flex: 1 }}>{ex.title}</h1>
        <button
          className={`star-btn ${isFav ? "active" : ""}`}
          style={{ position: "static", flexShrink: 0 }}
          onClick={() => toggle(ex.id)}
          title={isFav ? "Убрать из моей аптечки" : "В мою аптечку"}
          aria-label="избранное"
        >
          <Star size={20} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="muted" style={{ marginBottom: compact ? 16 : 20, lineHeight: 1.5, fontSize: compact ? "0.98rem" : undefined }}>
        {ex.intro}
      </p>

      {MASCOT[ex.id] && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <Raccoon pose={MASCOT[ex.id].pose} item={MASCOT[ex.id].item} size={compact ? 108 : 122} />
        </div>
      )}

      <Body ex={ex} />
    </div>
  );
}
