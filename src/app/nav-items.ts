export type NavItem = {
  to: string;
  label: string;
};

export const navItems: readonly NavItem[] = [
  { to: "/", label: "Inicio" },
  { to: "/fields", label: "Campos" },
  { to: "/forms", label: "Formularios" },
  { to: "/projects", label: "Proyectos" },
  { to: "/chronicles", label: "Crónicas" },
  { to: "/settings", label: "Configuración" },
  { to: "/how-it-works", label: "Cómo funciona" },
  { to: "/help", label: "Ayuda" },
  { to: "/support", label: "Soporte" },
];
