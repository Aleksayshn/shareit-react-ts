import type { Metadata } from "next";
import { AppProviders } from "@/src/app/providers";
import { AppHeader } from "@/src/widgets";
import { getSessionUser } from "@/src/shared/auth/server";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ShareIt",
    template: "%s | ShareIt",
  },
  description:
    "Share useful things with others and borrow what you need.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body>
        <AppProviders initialUser={user}>
          <AppHeader />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
