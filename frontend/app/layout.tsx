import type { Metadata } from "next";
import "./globals.css";
import BoomerangVideoBg from "@/components/BoomerangVideoBg";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "PathFinder",
  description: "AI-powered Legal Documentation Navigator for Aadhaar Inclusion"
};

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://db.onlinewebfonts.com/c/6e47ef470dd19698c911332a9b4d1cf4?family=Neue+Haas+Grotesk+Text+Pro" rel="stylesheet" />
        <link href="https://db.onlinewebfonts.com/c/dec0d9b4e22ca588dc20e1e2e09a59b5?family=Neue+Haas+Grotesk+Display+Pro+55+Roman" rel="stylesheet" />
      </head>
      <body className="min-h-screen relative overflow-x-hidden font-sans" suppressHydrationWarning>
        <ThemeInitializer />
        <LanguageProvider>
          <BoomerangVideoBg src={BG_VIDEO} className="fixed inset-0 -z-10 h-full w-full opacity-50 dark:opacity-20" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 md:px-10">
              <div className="rounded-3xl bg-white/50 backdrop-blur-xl p-8 shadow-2xl shadow-black/5 border border-white/40 dark:bg-black/30 dark:border-white/10 min-h-[calc(100vh-10rem)]">
                {children}
              </div>
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
