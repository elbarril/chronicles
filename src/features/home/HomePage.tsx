import {
  BookOpen,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  Lightbulb,
  Settings,
  Tag,
  Users,
  Wrench,
} from "lucide-react";
import { Link } from "react-router";

import { homeMessages } from "@/features/home/messages";
import { cn } from "@/lib/utils";

const navSections = [
  { to: "/fields", label: "Campos", Icon: Tag, tourId: "hub.fields" },
  { to: "/forms", label: "Formularios", Icon: ClipboardList, tourId: "hub.forms" },
  { to: "/groups", label: "Grupos", Icon: Users, tourId: "hub.groups" },
  { to: "/encounters", label: "Encuentros", Icon: CalendarDays, tourId: "hub.encounters" },
  { to: "/chronicles", label: "Crónicas", Icon: BookOpen, tourId: "hub.chronicles" },
  { to: "/settings", label: "Configuración", Icon: Settings, tourId: "hub.settings" },
  { to: "/how-it-works", label: "Cómo funciona", Icon: Lightbulb, tourId: undefined },
  { to: "/help", label: "Ayuda", Icon: CircleHelp, tourId: undefined },
  { to: "/support", label: "Soporte", Icon: Wrench, tourId: undefined },
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
          {navSections.map(({ to, label, Icon, tourId }) => (
            <li key={to}>
              <Link
                to={to}
                data-tour={tourId}
                className={cn(
                  "group flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl",
                  "bg-card border p-4 text-center transition-colors",
                  "hover:bg-accent hover:border-accent",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                )}
              >
                <Icon
                  className="text-foreground group-hover:text-accent-foreground h-12 w-12 transition-colors"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <span className="text-muted-foreground group-hover:text-accent-foreground text-xs leading-tight font-medium transition-colors">
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
