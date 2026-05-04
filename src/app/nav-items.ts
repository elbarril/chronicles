export type NavItem = {
  to: string;
  label: string;
};

export const navItems: readonly NavItem[] = [
  { to: "/", label: "Inicio" },
  { to: "/forms", label: "Formularios" },
  { to: "/projects", label: "Proyectos" },
  { to: "/chronicles", label: "Crónicas" },
  { to: "/settings", label: "Configuración" },
  { to: "/help", label: "Ayuda" },
  { to: "/support", label: "Soporte" },
];
