"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { Globe, ChevronDown } from "lucide-react";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, requestLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/30 px-4 text-sm font-semibold text-foreground backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/60 dark:hover:bg-black/50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span>{language === "hi" ? "हिंदी" : "English"}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl p-2 z-50 animate-fade-in">
          <button
            onClick={() => {
              setLanguage("en");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              language === "en"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            English
          </button>
          <button
            onClick={() => {
              setLanguage("hi");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              language === "hi"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            हिंदी (Hindi)
          </button>
          <div className="h-px bg-white/40 dark:bg-white/10 my-1" />
          <button
            onClick={() => {
              requestLanguage();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all duration-200"
          >
            {language === "hi" ? "अन्य भाषा का अनुरोध करें..." : "Request More Languages..."}
          </button>
        </div>
      )}
    </div>
  );
};
