import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotificationBanner from "@/components/NotificationBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NaijaConnect Capital - Diaspora Investment Platform",
  description:
    "Secure investment platform connecting Nigerian diaspora with pre-vetted investment opportunities in Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <NotificationBanner />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
