import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";

import { navItems } from "@/app/nav-items";
import { useTheme } from "@/app/theme";
import { cn } from "@/lib/utils";

export function MobileNavDrawer(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  function handleSelect() {
    setOpen(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        type="button"
        aria-label="Abrir menú de navegación"
        className={cn(
          "border-input bg-background hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-ring inline-flex h-11 w-11 items-center justify-center",
          "rounded-full border transition-colors",
          "focus-visible:ring-1 focus-visible:outline-none",
        )}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "bg-background fixed inset-y-0 right-0 z-50 flex h-full w-[85%] max-w-xs flex-col",
            "p-5 shadow-2xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          )}
        >
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-base font-semibold tracking-tight">
              Navegación
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              type="button"
              aria-label="Cerrar menú de navegación"
              className={cn(
                "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
                "inline-flex h-11 w-11 items-center justify-center rounded-full",
                "transition-colors focus-visible:ring-1 focus-visible:outline-none",
              )}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="sr-only">
            Listado de secciones disponibles en Chronicle.
          </DialogPrimitive.Description>
          <nav className="mt-3 flex flex-1 flex-col gap-1" aria-label="Navegación principal móvil">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={handleSelect}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-11 items-center rounded-full px-4 py-2 text-base font-medium",
                    "transition-colors focus-visible:ring-1 focus-visible:outline-none",
                    "focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 pt-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
              aria-pressed={isDark}
              className={cn(
                "flex min-h-11 w-full items-center justify-between gap-3 rounded-full px-4 py-2",
                "text-base font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
              )}
            >
              <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>
              {isDark ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
