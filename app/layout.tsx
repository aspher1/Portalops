import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PortalOps AI",
  description: "Supervised payer portal operations for provider enrollment teams",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
