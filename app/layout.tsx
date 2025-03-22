import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Animated hero backgrounds ",
  description: "Created with v0 and Next.js",
  generator: "v0.dev",
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
