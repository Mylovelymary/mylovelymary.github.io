import { Inter } from "next/font/google";
import "./globals.css";
import SwRegister from "@/components/SwRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
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
  themeColor: "#0e1118",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
