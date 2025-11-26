import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConciliacionesProvider } from "@/lib/contexts/ConciliacionesContext";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Conciliador Bancario",
  description: "Sistema de conciliación bancaria para ejecutivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body 
        className={`${inter.variable} font-sans antialiased bg-gray-50`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <ConciliacionesProvider>
            {children}
          </ConciliacionesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
