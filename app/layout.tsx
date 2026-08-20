import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";
import { SITE_NAME, SITE_URL } from "../lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Somos Era | Tecnología original en Argentina",
    template: `%s | ${SITE_NAME}`,
  },
  description: "Tecnología original e importada. iPhone, Samsung, cámaras, gaming y más, con envíos a todo el país y retiro en Palermo.",
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    title: "Somos Era | Tecnología original en Argentina",
    description: "Tecnología original e importada, con envíos a todo el país y retiro en Palermo.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Somos Era | Tecnología original en Argentina",
    description: "Tecnología original e importada, con envíos a todo el país y retiro en Palermo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} select-none antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/era-logo.png`,
              sameAs: ["https://www.instagram.com/_somosera"],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+54-9-11-7125-4322",
                contactType: "sales",
                areaServed: "AR",
                availableLanguage: "Spanish",
              },
            }),
          }}
        />
        {children}
          <Footer />
      </body>
    </html>
  );
}
