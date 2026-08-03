import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import type { ReactNode } from 'react';

// global style dependencies
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Treefingers | Collaborative writing',
};

export const viewport: Viewport = {
  themeColor: '#000',
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text&family=Open+Sans:wght@400;700&display=swapswap" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
