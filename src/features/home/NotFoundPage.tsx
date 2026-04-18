import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export function NotFoundPage(): JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Esa ruta no existe</h1>
      <p className="text-muted-foreground">Volvé al inicio para seguir con el flujo principal.</p>
      <Button asChild>
        <Link to="/">Ir al inicio</Link>
      </Button>
    </section>
  );
}
