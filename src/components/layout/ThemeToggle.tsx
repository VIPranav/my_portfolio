"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";
const themes: Theme[] = ["system", "light", "dark"];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (value: Theme) => {
      setTheme(value);
      document.documentElement.dataset.theme =
        value === "system" ? (media.matches ? "dark" : "light") : value;
    };
    const read = (): Theme => {
      try {
        const stored = localStorage.getItem("portfolio-theme");
        return stored === "light" || stored === "dark" ? stored : "system";
      } catch {
        return "system";
      }
    };
    apply(read());
    const sync = () => apply(read());
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function cycleTheme() {
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    document.documentElement.dataset.theme =
      next === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      // Theme switching remains available when browser storage is disabled.
    }
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={cycleTheme}
      aria-label={`Theme: ${theme}. Switch to ${themes[(themes.indexOf(theme) + 1) % themes.length]} theme`}
    >
      <span aria-hidden="true">◐</span>
      <span>{theme}</span>
    </button>
  );
}
