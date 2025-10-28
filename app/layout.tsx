import type { Metadata } from 'next';

import { Inter, JetBrains_Mono } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Image Processor',
  description: 'Professional image processing toolkit',
  generator: 'v0.app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
