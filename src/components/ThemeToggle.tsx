import { useEffect, useState } from "react";
import SunIcon from "@/components/SunIcon";
import MoonIcon from "@/components/MoonIcon";

type Theme = "system" | "light" | "dark";

const CYCLE: Record<Theme, Theme> = {
  system: "light",
  light: "dark",
  dark: "system",
};

function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme | null) ?? "system",
  );

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const bg =
    theme === "system"
      ? "bg-[linear-gradient(135deg,_white_50%,_#1f2937_50%)] border-2 border-gray-800 dark:border-white"
      : "bg-gray-800 dark:bg-gray-200";

  const icon =
    theme === "light" ? (
      <SunIcon className="size-5 text-white" />
    ) : theme === "dark" ? (
      <MoonIcon className="size-5 text-gray-800" />
    ) : null;

  return (
    <button
      onClick={() => setTheme(CYCLE[theme])}
      className={`flex size-11 items-center justify-center rounded-full transition cursor-pointer hover:scale-110 active:scale-95 ${bg}`}
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {icon}
    </button>
  );
}
