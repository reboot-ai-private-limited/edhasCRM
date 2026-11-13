import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import '@fontsource-variable/inter';
import './globals.css';

export const metadata: Metadata = { title: 'Edhas', description: 'Edhas admin portal' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
