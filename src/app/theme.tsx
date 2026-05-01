import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

const THEME_KEY = "chronicle-theme";
const BRAND_KEY = "chronicle-brand";

export type Theme = "light" | "dark";
export type BrandColor = "amber" | "indigo" | "forest";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  brandColor: BrandColor;
  setBrandColor: (brand: BrandColor) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  // Light mode is the default; we intentionally ignore system preference here
  // so the experience matches the reference design out of the box.
  return "light";
}

function getInitialBrandColor(): BrandColor {
  if (typeof window === "undefined") return "amber";
  const stored = window.localStorage.getItem(BRAND_KEY);
  if (stored === "amber" || stored === "indigo" || stored === "forest") return stored;
  return "amber";
}

export function ThemeProvider({ children }: PropsWithChildren): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [brandColor, setBrandColorState] = useState<BrandColor>(() => getInitialBrandColor());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.brand = brandColor;
  }, [brandColor]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(THEME_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const setBrandColor = useCallback((brand: BrandColor) => {
    setBrandColorState(brand);
    window.localStorage.setItem(BRAND_KEY, brand);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme, setTheme, brandColor, setBrandColor }),
    [theme, toggleTheme, setTheme, brandColor, setBrandColor],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return value;
}
