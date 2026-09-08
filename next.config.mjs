/** @type {import('next').NextConfig} */
const nextConfig = {
  // Статический экспорт: сайт можно выложить на любой бесплатный хостинг
  // (GitHub Pages, Netlify, Vercel), офлайн обеспечивает public/sw.js
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
