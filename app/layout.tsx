import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter, Martian_Mono } from "next/font/google";
import { BookingProvider } from "@/components/booking/booking-context";
import { ThemeStyle } from "@/components/theme-style";
import "./globals.css";
import "./ui.css";

// Figures and counts use Martian Mono at its widest width (semi-expanded, 112.5%).
const martianMono = Martian_Mono({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-martian-mono",
  display: "swap",
});

// Figures inside tables use Inter with tabular digits so columns still line up.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sanova",
    template: "%s · Sanova",
  },
  description: "Sanova clinic dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} ${martianMono.variable} ${inter.variable}`}>
      <head>
        {/* Before first paint, mark a remembered collapsed sidebar so the page loads as a rail instead of shrinking after hydration. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("sanova:sidebar-collapsed")==="1")document.documentElement.setAttribute("data-sidebar-boot","")}catch(e){}` }} />
        <ThemeStyle />
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      </head>
      <body>
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
