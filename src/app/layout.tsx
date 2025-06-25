import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./global.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PVP Lens - World of Warcraft PVP Stats",
  description: "Track and analyze World of Warcraft PVP statistics for North American players. View ratings, match history, and performance analytics.",
  keywords: ["World of Warcraft", "WoW", "PVP", "Arena", "Battlegrounds", "Statistics", "Leaderboards"],
  authors: [{ name: "PVP Lens Team" }],
  creator: "PVP Lens",
  publisher: "PVP Lens",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pvplens.com'),
  openGraph: {
    title: "PVP Lens - WoW PVP Statistics",
    description: "Track and analyze World of Warcraft PVP statistics for North American players.",
    url: 'https://pvplens.com',
    siteName: 'PVP Lens',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PVP Lens - WoW PVP Statistics",
    description: "Track and analyze World of Warcraft PVP statistics for North American players.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta httpEquiv="Permissions-Policy" content="clipboard-write=(), clipboard-read=()" />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} antialiased`}>
        <ErrorBoundary>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
