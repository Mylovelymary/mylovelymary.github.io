import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import SwRegister from "@/components/SwRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
});

export const metadata = {
  title: "Аптечка | Скорая помощь при панике и тревоге",
  description:
    "Бесплатная интерактивная аптечка при панических атаках, тревоге и тяжёлых днях. Без регистрации, работает офлайн. Упражнения, собранные из опыта реальных людей.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Аптечка",
  },
};

export const viewport = {
  themeColor: "#0b0e16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
