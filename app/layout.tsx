import localFont from "next/font/local";
import "./globals.css";

const iosevka = localFont({
  src: "../public/IosevkaCharon-Medium.ttf",
  variable: "--iosevka",
});

const lido = localFont({
  variable: "--lido",
  src: [
    { path: "../public/LidoSTF.ttf" },
    { path: "../public/LidoSTFItalic.ttf", style: "italic" },
  ],
});

const fontClasses = [iosevka, lido].map((f) => f.variable).join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="me" href="https://boskovice.social/@zoul" />
        <meta name="fediverse:creator" content="@zoul@boskovice.social" />
        <script
          data-domain="zoul.cz"
          src="https://plausible.io/js/script.outbound-links.js"
          defer
        />
      </head>
      <body className={fontClasses}>
        <main>{children}</main>
      </body>
    </html>
  );
}
