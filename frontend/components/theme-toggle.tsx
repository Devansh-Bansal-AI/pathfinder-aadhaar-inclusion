"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("pathfinder-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() => {
        const next = !dark;
        setDark(next);
        localStorage.setItem("pathfinder-theme", next ? "dark" : "light");
        document.documentElement.classList.toggle("dark", next);
      }}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
