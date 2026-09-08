import Link from "next/link";

// Аккуратная кнопка «назад» — пилюля с выровненной стрелкой.
export default function BackButton({ href = "/", label = "Назад" }) {
  return (
    <Link href={href} className="btn-back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="M11 18l-6-6 6-6" />
      </svg>
      {label}
    </Link>
  );
}
