import type { Metadata } from "next";
import { AppProviders } from "@/src/app/providers";
import { AppHeader } from "@/src/widgets";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ShareIt",
    template: "%s | ShareIt",
  },
  description:
    "Share useful things with others and borrow what you need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppHeader />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
