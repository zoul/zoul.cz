import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tomáš Znamenáček",
  description: "Dělám věci, občas to funguje, občas ne",
  openGraph: {
    images: "https://i.ohlasy.info/i/bce5f08a.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <link rel="me" href="https://boskovice.social/@zoul" />
        <meta name="fediverse:creator" content="@zoul@boskovice.social" />
        <script
          data-domain="zoul.cz"
          src="https://plausible.io/js/script.js"
          defer
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
