"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded shadow"
    >
      {theme === "light" ? "Switch to Dark" : "Switch to Light"}
    </button>
  );
}
