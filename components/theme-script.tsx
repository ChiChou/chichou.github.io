"use client";

import { useLayoutEffect } from "react";

export function ThemeScript() {
  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    if (
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return null;
}
