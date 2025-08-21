import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/style.css"
import Providers from "./Providers";
import { poppins } from "@/fonts";
import { Toaster } from 'sonner'

import AuthListener from "@/components/auth/AuthListener";
import SessionSync from "@/components/session-sync";
import CookieConsent from "@/components/cookie-consent";
import PWAInstallPrompt from "@/components/pwa/PWAIntallPrompt";

export const metadata: Metadata = {
  title: 'Flash Kanji | Kanji learning SRS companion',
  description: 'Flash Kanji is an interactive learning platform that helps users study Japanese Kanji through flashcards, quizzes, and spaced repetition, making learning effective and engaging.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs15', 'next', 'pwa', 'progressive web app', 'flash kanji', 'kanji', 'spaced repetition system'],
  authors: [
    { name: 'Te Nyain Moe Lwin' },
    {
      name: 'Te Nyain Moe Lwin',
      url: 'https://flashkanji.tenyain.com/',
    },
  ],
  icons: [
    { rel: 'apple-touch-icon', url: '/ios/128.png' },
    { rel: 'icon', url: '/icons/128.png' },
  ],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  // shrinkToFit: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Flash Kanji" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Flash Kanji" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F57C00" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <link rel="apple-touch-icon" href="/icons/152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/152.png" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
        
        <link rel="shortcut icon" href="/favicon.ico" />
        
        <meta name="msapplication-TileImage" content="/icons/144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${poppins.className} min-h-screen antialiased text-dark dark:text-gray-100  dark:bg-backdrop`}
      >
        <Providers>
          <SessionSync />
          <AuthListener />
          <Toaster position="top-right" richColors />
          {children}
          <CookieConsent />
          <PWAInstallPrompt/>
        </Providers>
      </body>
    </html>
  );
}
