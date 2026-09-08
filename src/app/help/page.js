import Link from "next/link";

export const metadata = { title: "Телефоны поддержки | Аптечка" };

const LINES = [
  {
    name: "Экстренная психологическая помощь МЧС России",
    phone: "+7 (495) 989-50-50",
    tel: "+74959895050",
    note: "Круглосуточно, бесплатно. Психологи, которые работают с острыми состояниями.",
  },
  {
    name: "Московская служба психологической помощи",
    phone: "051 (с городского) / +7 (495) 051 (с мобильного)",
    tel: "+7495051",
    note: "Круглосуточно, бесплатно для жителей Москвы.",
  },
  {
    name: "Всероссийский детский телефон доверия",
    phone: "8-800-2000-122",
    tel: "88002000122",
    note: "Для детей, подростков и их родителей. Круглосуточно, бесплатно, анонимно.",
  },
  {
    name: "Горячая линия психологической помощи (Минздрав)",
    phone: "8-800-100-49-94",
    tel: "88001004994",
    note: "Круглосуточно, бесплатно из любого региона России.",
  },
];

export default function HelpPage() {
  return (
    <main className="container">
      <div className="ex-topbar">
        <Link href="/" className="btn-ghost">← Назад</Link>
      </div>

      <h1 className="title" style={{ marginBottom: 10 }}>☎️ Живой голос рядом</h1>
      <p className="muted" style={{ marginBottom: 24, lineHeight: 1.55 }}>
        Иногда упражнений мало и нужен живой человек. Это нормально — попросить помощи.
        Все линии ниже бесплатные, на них отвечают обученные люди, и им можно звонить
        именно в таком состоянии, как у тебя сейчас.
      </p>

      {LINES.map((l) => (
        <a key={l.tel} href={`tel:${l.tel}`} className="step-item" style={{ textDecoration: "none", color: "var(--text)" }}>
          <span style={{ fontSize: "1.6rem" }}>📞</span>
          <div>
            <div style={{ fontWeight: 700 }}>{l.name}</div>
            <div style={{ color: "var(--sky)", fontWeight: 700, fontSize: "1.15rem", margin: "4px 0" }}>{l.phone}</div>
            <div className="dim" style={{ fontSize: "0.88rem" }}>{l.note}</div>
          </div>
        </a>
      ))}

      <p className="dim" style={{ fontSize: "0.88rem", marginTop: 10, lineHeight: 1.5 }}>
        Нажми на карточку — телефон начнёт набирать номер. Если номер изменился или не
        отвечает, поищи «телефон психологической помощи» + свой город.
      </p>

      <hr className="sep" />

      <h2 style={{ fontSize: "1.15rem", marginBottom: 10 }}>Когда стоит идти к специалисту</h2>
      <p className="muted" style={{ lineHeight: 1.6, fontSize: "0.95rem" }}>
        Аптечка помогает пережить острый момент, но если панические атаки или тяжесть
        повторяются — самый надёжный путь это психотерапия. Люди, чей опыт собран здесь,
        справились именно так: упражнения снимали приступ, а терапия убирала причину.
        Идти к психологу — не слабость, а такой же нормальный шаг, как к стоматологу с зубом.
      </p>
    </main>
  );
}
