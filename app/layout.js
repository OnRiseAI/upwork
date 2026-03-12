import "./globals.css";
import SharedLayout from "./components/SharedLayout";

export const metadata = {
  title: "We Pick Up The Phone — AI Voice Receptionist",
  description:
    "AI receptionists that sound human, work 24/7, and never put a caller on hold. Try a live demo — no signup required.",
  metadataBase: new URL("https://wepickupthephone.com"),
  openGraph: {
    title: "We Pick Up The Phone — AI Voice Receptionist",
    description:
      "Every call answered. Every customer impressed. Try our AI receptionist live.",
    url: "https://wepickupthephone.com",
    siteName: "We Pick Up The Phone",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "We Pick Up The Phone — AI Voice Receptionist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Pick Up The Phone — AI Voice Receptionist",
    description:
      "Every call answered. Every customer impressed. Try our AI receptionist live.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        <SharedLayout>{children}</SharedLayout>
      </body>
    </html>
  );
}
