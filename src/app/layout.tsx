import { Bebas_Neue, Inter } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppProviders } from "@/components/providers/AppProviders";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`${bebas.variable} ${inter.variable}`}>
      <body className="antialiased pb-14 md:pb-0">
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
