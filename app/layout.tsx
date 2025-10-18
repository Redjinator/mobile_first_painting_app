import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaintingBuddy - Painting Contractor Management",
  description: "Mobile-first painting contractor management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
