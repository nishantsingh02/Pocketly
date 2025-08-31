import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Set initial theme
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Toggle dark class on html element
    document.documentElement.classList.toggle("dark");
    
    // Save preference to localStorage
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      ) : (
        <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      )}
    </Button>
  );
};
