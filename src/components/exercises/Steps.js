// Наглядные пункты-подсказки. Без чекбоксов: это руководство перед глазами,
// а не список задач — в панике ничего «отмечать» не нужно.
export default function Steps({ steps }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} className="step-item">
          <div className="step-num">{i + 1}</div>
          <div className="step-text">{s.text}</div>
        </div>
      ))}
    </div>
  );
}
