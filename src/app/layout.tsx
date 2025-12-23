import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, QueryProvider, NavigationLoader } from "@/components";
import { ToastContainer } from "@/components/Toast";
import StoreProvider from "@/lib/providers/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RCM",
  description: "RCM is a platform to manage membership and groups of a church",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
