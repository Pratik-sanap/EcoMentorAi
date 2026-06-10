// src/app/layout.tsx
import React from "react";
import { MainLayout } from "../components/MainLayout";
import "../styles/globals.css";

export const metadata = {
  title: "EcoMentor AI",
  description: "Carbon footprint awareness platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head />
      <body className="bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
