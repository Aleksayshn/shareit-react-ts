import type { Metadata } from "next";
import { AppProviders } from "@/src/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ShareIt MVP",
    template: "%s | ShareIt",
  },
  description:
    "ShareIt frontend foundation built with Next.js, TanStack Query, Zustand, and a feature-sliced structure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
