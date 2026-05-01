import { Link, Outlet, useLocation } from "react-router";

import { MobileNavDrawer } from "@/app/MobileNavDrawer";
import { navItems } from "@/app/nav-items";
import { OnboardingDialog } from "@/features/onboarding/components/OnboardingDialog";
import { cn } from "@/lib/utils";

function getCurrentPageLabel(pathname: string): string {
  // Prefer exact nav match, then longest prefix match.
  const exact = navItems.find((item) => item.to === pathname);
  if (exact) return exact.label;

  const prefixed = [...navItems]
    .filter((item) => item.to !== "/" && pathname.startsWith(item.to))
    .sort((a, b) => b.to.length - a.to.length)[0];
  if (prefixed) return prefixed.label;

  return "Chronicle";
}

export function RootLayout(): JSX.Element {
  const location = useLocation();
  const pageLabel = getCurrentPageLabel(location.pathname);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50",
          "focus:bg-background focus:text-foreground focus:rounded-full focus:px-3 focus:py-2 focus:shadow",
        )}
      >
        Saltar al contenido principal
      </a>
      <header>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 sm:py-5">
          <Link
            to="/"
            aria-label="Ir al inicio"
            className="text-muted-foreground hover:text-foreground justify-self-start text-xs font-medium tracking-widest uppercase transition-colors"
          >
            Chronicle
          </Link>
          <p
            role="status"
            aria-live="polite"
            className={cn(
              "bg-primary text-primary-foreground justify-self-center",
              "rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase",
              "max-w-[60vw] truncate sm:text-sm",
            )}
          >
            {pageLabel}
          </p>
          <div className="justify-self-end">
            <MobileNavDrawer />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        role="main"
        className="mx-auto w-full max-w-5xl flex-1 px-4 pt-2 pb-10 sm:pt-4"
      >
        <Outlet />
      </main>

      <footer className="text-muted-foreground px-4 py-6 text-center text-xs tracking-wide">
        Chronicle · Observaciones y crónicas local-first
      </footer>

      <OnboardingDialog />
    </div>
  );
}
