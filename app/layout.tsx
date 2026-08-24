import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timezone Converter — Convert Time Across the World",
  description:
    "Convert time between timezones instantly. Select your timezone, choose the locations you care about, and see their local times side by side.",
  openGraph: {
    title: "Timezone Converter — Convert Time Across the World",
    description:
      "Convert time between timezones instantly. Select your timezone, choose the locations you care about, and see their local times side by side.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
