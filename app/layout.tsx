import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "AI Product Description Generator",
  description: "Generate SEO-optimized product descriptions in seconds using AI. Boost your e-commerce sales today!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: 'AI Product Description Generator',
    description: 'Generate high-converting product descriptions with AI.',
    url: 'https://copynest.shop',
    siteName: 'CopyNest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Product Description Generator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Product Description Generator',
    description: 'Generate high-converting product descriptions in seconds with AI.',
    images: ['/og-image.png'],
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
        {/* Meta tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Razorpay Payment SDK */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        <title>AI Product Description Generator</title>
        <meta name="description" content="Generate SEO-optimized product descriptions in seconds using AI. Boost your e-commerce sales today!" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
