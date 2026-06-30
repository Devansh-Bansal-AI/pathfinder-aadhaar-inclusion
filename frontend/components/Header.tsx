"use client";

import Link from "next/link";
import { FileCheck2, Home, PlusCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useLanguage();
  return (
    <header className="no-print border-b border-white/40 bg-white/60 backdrop-blur-xl shadow-sm dark:bg-black/40 dark:border-white/10 sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#336443] dark:text-primary">
          <FileCheck2 className="h-6 w-6" />
          <span className="text-xl tracking-tight">{t("pathfinder")}</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#4b5b47] hover:bg-white/60 hover:text-[#1f2a1d] hover:shadow-sm dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95" href="/">
            <Home className="h-4 w-4" />
            {t("dashboard")}
          </Link>
          <Link className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-b from-[#2a3827] to-[#1f2a1d] px-5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:from-[#1f2a1d] hover:to-[#1a2318] dark:from-primary/90 dark:to-primary dark:hover:to-primary/90 transition-all duration-300 hover:-translate-y-0.5 active:scale-95" href="/cases/new">
            <PlusCircle className="h-4 w-4" />
            {t("new_case")}
          </Link>
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
