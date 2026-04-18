import { useEffect, useState, type PropsWithChildren } from "react";

import { Toaster } from "@/components/ui/sonner";
import { db } from "@/infra/db/client";

const THEME_KEY = "chronicle-theme";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function Providers({ children }: PropsWithChildren): JSX.Element {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    db.open().catch(() => undefined);
  }, []);

  function handleToggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <>
      <div className="sr-only" aria-live="polite">
        Tema actual: {theme === "dark" ? "oscuro" : "claro"}
      </div>
      <button
        className="sr-only"
        type="button"
        onClick={handleToggleTheme}
        aria-label="Alternar tema"
      >
        Alternar tema
      </button>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
