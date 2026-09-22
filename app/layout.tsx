import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "DYT | Do Your Tee",
    template: "%s | DYT"
  },
  description: "DYT is a Pakistani streetwear label for graphic tees, oversized fits, and bold everyday apparel.",
  openGraph: {
    title: "DYT | Do Your Tee",
    description: "Premium Pakistani streetwear and graphic tees.",
    siteName: "DYT",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
