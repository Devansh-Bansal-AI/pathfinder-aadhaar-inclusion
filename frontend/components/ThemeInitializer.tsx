"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    const stored = localStorage.getItem("pathfinder-theme");
    const isDark = stored === "dark";
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return null;
}
