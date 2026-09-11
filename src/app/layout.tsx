import { Inter, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppProviders } from "@/components/providers/AppProviders";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import "./globals.css";

const playfair = Playfair_Display({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Italian Watches",
  description: "Premium multi-brand luxury watch destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <AppProviders>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBottomBar />
        </AppProviders>
      </body>
    </html>
  );
}
