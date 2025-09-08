import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tubedao.org/'),
  title: "TubeDAO - Own Your YouTube Data",
  description: "The first YouTube Premium Data DAO built on Vana. Contribute your behavioral data, participate in governance, and earn tokens when your insights are licensed to researchers and brands.",
  keywords: ["TubeDAO", "YouTube", "Data DAO", "Vana", "Web3", "Privacy", "Data Ownership", "Blockchain"],
  authors: [{ name: "TubeDAO Team" }],
  creator: "TubeDAO",
  publisher: "TubeDAO",
  
  // Favicon and icons
  icons: {
    icon: '/logo.png',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },

  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'TubeDAO - Own Your YouTube Data',
    description: 'The first YouTube Premium Data DAO built on Vana. Contribute your behavioral data, participate in governance, and earn tokens when your insights are licensed to researchers and brands.',
    siteName: 'TubeDAO',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'TubeDAO - Own Your YouTube Data',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'TubeDAO - Own Your YouTube Data',
    description: 'The first YouTube Premium Data DAO built on Vana. Upload, vote, earn. 🎬✨',
    creator: '@TubeDAO',
    site: '@TubeDAO',
    images: ['/logo.png'],
  },

  // Additional meta tags
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

  // Verification and analytics preparation
  verification: {
    // google: 'your-google-verification-code',
    // other: 'your-other-verification-codes',
  },
};

// Separate viewport export (Next.js requirement)
export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TubeDAO",
    "description": "The first YouTube Premium Data DAO built on Vana ecosystem. Privacy-first behavioral data collection with user ownership and DAO governance.",
    "url": "https://tubedao.org/",
    "logo": "https://tubedao.org/",
    "sameAs": [
      "https://twitter.com/TubeDAO",
      "https://github.com/TubeDAO",
      "https://discord.gg/TubeDAO"
    ],
    "foundingDate": "2025",
    "industry": "Web3, Data Privacy, Blockchain",
    "keywords": "YouTube data, DAO, Web3, Privacy, Data ownership, Vana ecosystem"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
