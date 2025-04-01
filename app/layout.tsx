// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MyFitCoach.AI",
  description: "Votre coach IA personnalisé pour le fitness et la nutrition.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head />
      <body className={inter.variable + " font-inter bg-gray-50 text-gray-900"}>
        {children}
      </body>
    </html>
  );
}
