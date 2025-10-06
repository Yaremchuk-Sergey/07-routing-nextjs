import type { Metadata } from "next";
import "./globals.css";

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Simple notes app on Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
