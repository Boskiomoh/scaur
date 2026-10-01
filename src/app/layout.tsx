import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";

import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-martian",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Scaur: technical layers, rated on one scale",
    template: "%s | Scaur",
  },
  description:
    "A headless Shopify demo store for a fictional outdoor brand: four layers on one temperature scale, a kit builder and illustrative thermal views.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${martianMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only rounded-full bg-ink px-4 py-2 text-snow focus:not-sr-only focus:absolute focus:start-4 focus:top-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="grow">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
