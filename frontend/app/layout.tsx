import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, Home, PlusCircle } from "lucide-react";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import BoomerangVideoBg from "@/components/BoomerangVideoBg";

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
        <BoomerangVideoBg src={BG_VIDEO} className="fixed inset-0 -z-10 h-full w-full opacity-50 dark:opacity-20" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="no-print border-b border-white/60 bg-white/70 backdrop-blur-md shadow-sm dark:bg-black/50 dark:border-white/10">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
              <Link href="/" className="flex items-center gap-2 font-semibold text-[#336443] dark:text-primary">
                <FileCheck2 className="h-6 w-6" />
                <span className="text-xl tracking-tight">PathFinder</span>
              </Link>
              <nav className="flex items-center gap-2">
                <Link className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-[#4b5b47] hover:bg-white/50 hover:text-[#1f2a1d] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors" href="/">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1f2a1d] px-5 text-sm font-medium text-white hover:bg-[#2a3827] dark:bg-primary dark:hover:bg-primary/90 transition-colors" href="/cases/new">
                  <PlusCircle className="h-4 w-4" />
                  New Case
                </Link>
                <div className="ml-2">
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 md:px-10">
            <div className="rounded-xl bg-white/60 backdrop-blur-md p-6 shadow-xl border border-white/40 dark:bg-black/40 dark:border-white/10 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
