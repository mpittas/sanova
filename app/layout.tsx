import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeStyle } from "@/components/theme-style";
import "./globals.css";
import "./ui.css";

export const metadata: Metadata = {
  title: {
    default: "Sanova",
    template: "%s · Sanova",
  },
  description: "Sanova clinic dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <ThemeStyle />
      </head>
      <body>{children}</body>
    </html>
  );
}
