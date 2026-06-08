import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "SmartHotel",
  description: "Application de gestion hôtel & piscine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${manrope.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="h-full bg-[#F3F6FA] text-gray-800">
        {children}
      </body>
    </html>
  );
}