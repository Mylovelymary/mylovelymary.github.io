import Link from "next/link";
import BackButton from "@/components/BackButton";

export const metadata = { title: "Установить на телефон | Аптечка" };

export default function InstallPage() {
  return (
    <main className="container">
      <div className="ex-topbar">
        <BackButton />
      </div>

      <h1 className="title" style={{ marginBottom: 10 }}>📲 Аптечка всегда с собой</h1>
      <p className="muted" style={{ marginBottom: 24, lineHeight: 1.55 }}>
        Аптечку можно установить как приложение — она появится на домашнем экране
        и будет работать <b>даже без интернета</b>: в метро, в самолёте, где угодно.
        Это бесплатно и занимает меньше минуты.
      </p>

      <div className="section-label">iPhone (Safari)</div>
      <div className="panel" style={{ padding: "18px 20px" }}>
        <ol style={{ paddingLeft: 20, lineHeight: 1.9 }}>
          <li>Открой этот сайт в <b>Safari</b></li>
          <li>Нажми кнопку «Поделиться» <span style={{ opacity: 0.7 }}>(квадрат со стрелкой вверх внизу экрана)</span></li>
          <li>Выбери <b>«На экран “Домой”»</b></li>
          <li>Нажми «Добавить» — готово!</li>
        </ol>
      </div>

      <div className="section-label">Android (Chrome)</div>
      <div className="panel" style={{ padding: "18px 20px" }}>
        <ol style={{ paddingLeft: 20, lineHeight: 1.9 }}>
          <li>Открой сайт в <b>Chrome</b></li>
          <li>Нажми меню <b>⋮</b> в правом верхнем углу</li>
          <li>Выбери <b>«Установить приложение»</b> или «Добавить на главный экран»</li>
          <li>Подтверди — иконка появится на рабочем столе</li>
        </ol>
      </div>

      <div className="section-label">Компьютер (Chrome / Edge)</div>
      <div className="panel" style={{ padding: "18px 20px" }}>
        <p style={{ lineHeight: 1.7 }}>
          В адресной строке справа появится значок установки <b>⊕</b> — нажми его и
          подтверди. Аптечка откроется отдельным окном, как обычная программа.
        </p>
      </div>

      <div className="section-label">Чтобы точно работало офлайн</div>
      <div className="panel" style={{ padding: "18px 20px" }}>
        <p style={{ lineHeight: 1.7 }}>
          После установки открой Аптечку один раз с интернетом и просто полистай
          разделы — открой пару упражнений, зайди в режим SOS. Всё открытое
          сохранится на устройстве и будет доступно без сети.
        </p>
        <p className="dim" style={{ marginTop: 10, fontSize: "0.9rem", lineHeight: 1.6 }}>
          Твоя личная аптечка (звёздочки, свои фразы) тоже хранится прямо на устройстве —
          она никуда не отправляется и работает без интернета всегда.
        </p>
      </div>

      <Link href="/" className="btn btn-mint" style={{ marginTop: 26 }}>
        Вернуться на главную
      </Link>
    </main>
  );
}
