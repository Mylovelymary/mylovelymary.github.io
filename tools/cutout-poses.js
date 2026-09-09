// Вырезает 3 кадра Хагси из видео (белая комната) и кропает их ЕДИНЫМ
// прямоугольником, чтобы позы были согласованы по позиции и масштабу.
// pose1 = jump (n116), pose2 = stand (n152), pose3 = up (n230)
const sharp = require("sharp");

const FILES = { jump: "pose1.png", stand: "pose2.png", up: "pose3.png" };

async function cut(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mn > 178 && mx - mn < 18; // белые стены и серый пол
  };
  const alpha = new Uint8Array(W * H).fill(255);
  const visited = new Uint8Array(W * H);
  const qx = new Int32Array(W * H), qy = new Int32Array(W * H);
  let head = 0, tail = 0;
  const push = (x, y) => {
    const p = y * W + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (isBg(p * C)) { alpha[p] = 0; qx[tail] = x; qy[tail] = y; tail++; }
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (head < tail) {
    const x = qx[head], y = qy[head]; head++;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }
  // мягкая тень под лапами остаётся тёмной — уберём слабые полупрозрачные остатки:
  // всё, что фон не залил, но яркое и нейтральное И граничит с фоном по большой площади,
  // чистить сложно; вместо этого: ещё один проход fill с порогом 150 ТОЛЬКО из уже фоновых зон
  head = 0; tail = 0;
  const visited2 = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) {
    if (alpha[p] === 0) { visited2[p] = 1; qx[tail] = p % W; qy[tail] = (p / W) | 0; tail++; }
  }
  const isShadow = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mn > 138 && mx - mn < 20;
  };
  while (head < tail) {
    const x = qx[head], y = qy[head]; head++;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const p = ny * W + nx;
      if (visited2[p]) continue;
      visited2[p] = 1;
      if (isShadow(p * C)) { alpha[p] = 0; qx[tail] = nx; qy[tail] = ny; tail++; }
    }
  }
  // полупрозрачный край
  const soft = new Uint8Array(alpha);
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (alpha[p] === 255 && (alpha[p - 1] === 0 || alpha[p + 1] === 0 || alpha[p - W] === 0 || alpha[p + W] === 0)) soft[p] = 90;
    }
  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    rgba[p * 4] = data[p * C];
    rgba[p * 4 + 1] = data[p * C + 1];
    rgba[p * 4 + 2] = data[p * C + 2];
    rgba[p * 4 + 3] = soft[p];
  }
  // bbox непрозрачного
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (soft[y * W + x] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  return { rgba, W, H, bbox: { minX, minY, maxX, maxY } };
}

(async () => {
  const cutouts = {};
  let uMinX = 1e9, uMinY = 1e9, uMaxX = 0, uMaxY = 0;
  for (const [name, file] of Object.entries(FILES)) {
    const c = await cut(file);
    cutouts[name] = c;
    uMinX = Math.min(uMinX, c.bbox.minX);
    uMinY = Math.min(uMinY, c.bbox.minY);
    uMaxX = Math.max(uMaxX, c.bbox.maxX);
    uMaxY = Math.max(uMaxY, c.bbox.maxY);
    console.log(name, "bbox:", JSON.stringify(c.bbox));
  }
  const pad = 6;
  uMinX = Math.max(0, uMinX - pad);
  uMinY = Math.max(0, uMinY - pad);
  const w = Math.min(1280, uMaxX + pad) - uMinX;
  const h = Math.min(720, uMaxY + pad) - uMinY;
  console.log("union:", uMinX, uMinY, w, "x", h);

  const previews = [];
  for (const [name, c] of Object.entries(cutouts)) {
    const buf = await sharp(c.rgba, { raw: { width: c.W, height: c.H, channels: 4 } })
      .extract({ left: uMinX, top: uMinY, width: w, height: h })
      .webp({ quality: 84 })
      .toBuffer();
    await sharp(buf).toFile(`/home/maris.vigulis/Desktop/aptechka/public/hugsy-${name}.webp`);
    previews.push(await sharp({ create: { width: w, height: h, channels: 4, background: "#f6f3ec" } })
      .composite([{ input: buf }])
      .png().toBuffer());
    console.log(name, "->", buf.length, "байт");
  }
  // общий превью-лист
  const ph = 360;
  const scaled = [];
  for (const p of previews) scaled.push(await sharp(p).resize({ height: ph }).toBuffer());
  const pw = Math.round((w / h) * ph);
  await sharp({ create: { width: pw * 3 + 20, height: ph, channels: 3, background: "#333" } })
    .composite(scaled.map((b, i) => ({ input: b, left: i * (pw + 10), top: 0 })))
    .jpeg({ quality: 85 })
    .toFile(__dirname + "/poses-preview.jpg");
  console.log("превью готово, аспект кадра:", (h / w).toFixed(4));
})();
