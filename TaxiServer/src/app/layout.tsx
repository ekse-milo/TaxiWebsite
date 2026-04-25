import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OfflineBanner from "./connection/OfflineBanner";
import Script from "next/script";

const geistSans = Geist({

  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goa Taxi Service | Explore Goa in Comfort",
  description: "Premium Car Booking Service in Goa. Hatchbacks, Sedans, SUVs, and MUVs for Airport transfers, City tours, and Sightseeing.",
  keywords: ["Goa Taxi", "Cab Booking Goa", "Airport Transfer Goa", "Goa Sightseeing Cabs", "Premium Taxi Goa", "Hire Car Goa"],
  openGraph: {
    title: "Premium Goa Taxi Service",
    description: "Book comfortable, clean, and AC cabs for your Goa trip. Airport drops, sightseeing, and custom packages available.",
    url: "https://your-domain-here.com",
    siteName: "Goa Taxi Booking",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Goa Taxi Service",
    description: "Book reliable taxis in Goa for sightseeing and airport transfers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <OfflineBanner />

        {/* Instant Offline Check - Prevents landing page flicker */}
        <Script
          id="offline-check"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
              document.body.classList.add('is-offline-initial');
            }
          ` }}
        />


        <div className="main-app-content">
          {children}
        </div>
      </body>
    </html>
  );
}
