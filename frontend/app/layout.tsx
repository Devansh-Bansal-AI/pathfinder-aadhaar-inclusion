import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, Home, PlusCircle } from "lucide-react";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "PathFinder",
  description: "AI-powered Legal Documentation Navigator for Aadhaar Inclusion"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <header className="no-print border-b border-border bg-background/95">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
              <FileCheck2 className="h-6 w-6" />
              <span>PathFinder</span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm hover:bg-muted" href="/">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground" href="/cases/new">
                <PlusCircle className="h-4 w-4" />
                New Case
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
