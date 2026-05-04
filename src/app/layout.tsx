import { Link, Outlet } from "react-router";

import { MobileNavDrawer } from "@/app/MobileNavDrawer";
import { OnboardingDialog } from "@/features/onboarding/components/OnboardingDialog";
import { WelcomeNamePrompt } from "@/features/onboarding/components/WelcomeNamePrompt";
import { cn } from "@/lib/utils";

export function RootLayout(): JSX.Element {
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
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:py-5">
          <Link
            to="/"
            aria-label="Ir al inicio"
            className="text-muted-foreground hover:text-foreground text-xs font-medium tracking-widest uppercase transition-colors"
          >
            Chronicle
          </Link>
          <MobileNavDrawer />
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
      <WelcomeNamePrompt />
    </div>
  );
}
