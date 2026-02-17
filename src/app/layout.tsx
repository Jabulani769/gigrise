// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; // ← important!
import './globals.css';

// Prevent Font Awesome from automatically adding <style> tags
config.autoAddCss = false;

library.add(fas);

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // optional but nice for tailwind
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gigrise',
  description: 'Freelance & Marketplace Platform for Malawi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
