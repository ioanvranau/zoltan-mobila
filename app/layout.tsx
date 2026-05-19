import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { DemoBanner } from "@/components/ui/DemoBanner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zoltan · Mobilă la comandă în Cluj-Napoca",
    template: "%s · Zoltan · Mobilă la comandă",
  },
  description:
    "Bucătării, dressing-uri, living-uri și dormitoare făcute pe comandă în Cluj-Napoca. PAL melaminat și lemn masiv, montate la cheie.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-bg text-text font-sans antialiased">
        <a href="#main" className="skip-link">Sari la conținut</a>
        <DemoBanner />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
