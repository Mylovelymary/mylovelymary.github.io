import { EXERCISES, byId } from "@/data/exercises";
import ExercisePageClient from "./client";

export function generateStaticParams() {
  return EXERCISES.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const ex = byId[id];
  return { title: ex ? `${ex.title} | Аптечка` : "Аптечка" };
}

export default async function ExercisePage({ params }) {
  const { id } = await params;
  return <ExercisePageClient id={id} />;
}
