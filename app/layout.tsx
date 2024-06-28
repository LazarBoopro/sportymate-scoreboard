import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/ui/providers/QueryProvider.provider";

import "./globals.css";
import { NavbarContextProvider } from "@/ui/providers/NavbarContext.provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SportyMate Referee",
  description: "SportyMate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <QueryProvider>
          <NavbarContextProvider>
            <Toaster />
            {children}
          </NavbarContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
