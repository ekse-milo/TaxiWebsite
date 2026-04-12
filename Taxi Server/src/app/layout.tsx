import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OfflineBanner from "./connection/OfflineBanner";
import SessionManager from "./utilities/SessionManager";

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
        {/* Session & Connection Management */}
        <SessionManager />
        <OfflineBanner />

        {/* Instant Offline Check - Prevents landing page flicker */}
        <script dangerouslySetInnerHTML={{
          __html: `
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            document.body.classList.add('is-offline-initial');
          }
        ` }} />

        <div className="main-app-content">
          {children}
        </div>
      </body>
    </html>
  );
}
