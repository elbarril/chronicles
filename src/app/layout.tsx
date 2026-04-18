import { Link, Outlet, useLocation } from "react-router";

import { Button } from "@/components/ui/button";

export function RootLayout(): JSX.Element {
  const location = useLocation();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-border border-b">
        <nav
          className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3"
          aria-label="Navegación principal"
        >
          <Link to="/" className="font-semibold tracking-tight">
            Chronicle
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link to="/">Inicio</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/fields">Campos</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/forms">Formularios</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/groups">Grupos</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/encounters">Encuentros</Link>
            </Button>
            <span className="text-muted-foreground text-sm" aria-live="polite">
              {location.pathname}
            </span>
          </div>
        </nav>
      </header>

      <main id="main-content" role="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-muted-foreground border-border border-t px-4 py-4 text-center text-sm">
        Chronicle · Observaciones y crónicas local-first
      </footer>
    </div>
  );
}
