import type { Metadata } from 'next';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackClientApp } from '../stack/client';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider, QueryProvider, NavigationLoader } from '@/components';
import { ToastContainer } from '@/components/Toast';
import StoreProvider from '@/lib/providers/StoreProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MultiplyNet',
  description: 'The System for Cell Multiplication & Church Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Suspense fallback={null}>
              <StoreProvider>
                <QueryProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <NavigationLoader />
                    {children}
                  </ThemeProvider>
                  <ToastContainer position="top-right" />
                </QueryProvider>
              </StoreProvider>
            </Suspense>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
