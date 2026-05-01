import {
  BookOpen,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  Lightbulb,
  Settings,
  Tag,
  Upload,
  Users,
  Wrench,
} from "lucide-react";
import { Link } from "react-router";

import { homeMessages } from "@/features/home/messages";
import { cn } from "@/lib/utils";

const navSections = [
  { to: "/fields", label: "Campos", Icon: Tag },
  { to: "/forms", label: "Formularios", Icon: ClipboardList },
  { to: "/groups", label: "Grupos", Icon: Users },
  { to: "/encounters", label: "Encuentros", Icon: CalendarDays },
  { to: "/import", label: "Importar", Icon: Upload },
  { to: "/chronicles", label: "Crónicas", Icon: BookOpen },
  { to: "/settings", label: "Configuración", Icon: Settings },
  { to: "/how-it-works", label: "Cómo funciona", Icon: Lightbulb },
  { to: "/help", label: "Ayuda", Icon: CircleHelp },
  { to: "/support", label: "Soporte", Icon: Wrench },
] as const;

export function HomePage(): JSX.Element {
  return (
    <section className="space-y-8" aria-labelledby="home-title">
      <header className="space-y-2">
        <h1 id="home-title" className="text-3xl font-bold tracking-tight">
          {homeMessages.welcomeTitle}
        </h1>
        <p className="text-muted-foreground text-base">{homeMessages.welcomeSubtitle}</p>
      </header>

      <nav aria-label="Accesos directos a secciones">
        <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {navSections.map(({ to, label, Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "group flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl",
                  "border bg-card p-4 text-center transition-colors",
                  "hover:bg-accent hover:border-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <Icon
                  className="h-12 w-12 text-foreground transition-colors group-hover:text-accent-foreground"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium leading-tight text-muted-foreground transition-colors group-hover:text-accent-foreground">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
