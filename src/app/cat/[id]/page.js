import { CATEGORIES } from "@/data/exercises";
import CategoryPageClient from "./client";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const cat = CATEGORIES.find((c) => c.id === id);
  return { title: cat ? `${cat.label} | Аптечка` : "Аптечка" };
}

export default async function CategoryPage({ params }) {
  const { id } = await params;
  return <CategoryPageClient id={id} />;
}
