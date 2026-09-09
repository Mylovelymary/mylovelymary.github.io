// Вырезает фон у картинки Хагси (белый фон или фейковая «шахматка» из ИИ)
// и сохраняет лёгкий webp с прозрачностью.
//
// Запуск (нужен npm i sharp рядом или глобально):
//   node tools/cutout-bg.js <входной.jpg|png> <public/имя.webp> [высота=900]
//
// Метод: flood fill от краёв по почти-нейтральным светлым пикселям —
// белое пузо и светлый мех внутри контура не задеваются.
const sharp = require("sharp");

const [, , SRC, OUT, HEIGHT] = process.argv;
if (!SRC || !OUT) {
  console.log("Использование: node tools/cutout-bg.js <вход> <выход.webp> [высота]");
  process.exit(1);
}
const H = Number(HEIGHT) || 900;

(async () => {
  const { data, info } = await sharp(SRC).resize({ height: H }).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: HH, channels: C } = info;

  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mn > 196 && mx - mn < 16;
  };

  const alpha = new Uint8Array(W * HH).fill(255);
  const visited = new Uint8Array(W * HH);
  const qx = new Int32Array(W * HH), qy = new Int32Array(W * HH);
  let head = 0, tail = 0;
  const push = (x, y) => {
    const p = y * W + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (isBg(p * C)) { alpha[p] = 0; qx[tail] = x; qy[tail] = y; tail++; }
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, HH - 1); }
  for (let y = 0; y < HH; y++) { push(0, y); push(W - 1, y); }
  while (head < tail) {
    const x = qx[head], y = qy[head]; head++;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < HH - 1) push(x, y + 1);
  }

  const soft = new Uint8Array(alpha);
  for (let y = 1; y < HH - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (alpha[p] === 255 && (alpha[p - 1] === 0 || alpha[p + 1] === 0 || alpha[p - W] === 0 || alpha[p + W] === 0)) soft[p] = 90;
    }

  const rgba = Buffer.alloc(W * HH * 4);
  for (let p = 0; p < W * HH; p++) {
    rgba[p * 4] = data[p * C];
    rgba[p * 4 + 1] = data[p * C + 1];
    rgba[p * 4 + 2] = data[p * C + 2];
    rgba[p * 4 + 3] = soft[p];
  }

  const out = await sharp(rgba, { raw: { width: W, height: HH, channels: 4 } })
    .trim()
    .webp({ quality: 84 })
    .toBuffer();
  await sharp(out).toFile(OUT);
  const meta = await sharp(out).metadata();
  console.log(`готово: ${OUT} ${meta.width}x${meta.height}, ${out.length} байт (ratio ${(meta.height / meta.width).toFixed(4)})`);
})();
