import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

import { RootLayout } from "@/app/layout";
import { ThemeProvider } from "@/app/theme";
import { HelpPage } from "@/features/help/HelpPage";

function renderHelp(initialPath = "/help") {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <ThemeProvider>
            <RootLayout />
          </ThemeProvider>
        ),
        children: [{ path: "help", element: <HelpPage /> }],
      },
    ],
    { initialEntries: [initialPath] },
  );

  render(<RouterProvider router={router} />);
}

describe("Help route", () => {
  it("renders the page heading and the three tab triggers", () => {
    renderHelp();

    expect(screen.getByRole("heading", { name: /^ayuda$/i, level: 1 })).toBeInTheDocument();

    const tablist = screen.getByRole("tablist", { name: /secciones de ayuda/i });
    expect(tablist).toBeInTheDocument();

    expect(screen.getByRole("tab", { name: /funcionamientos/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^datos$/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^ia$/i })).toBeInTheDocument();
  });

  it("shows the 'funcionamientos' tab content by default", () => {
    renderHelp();

    expect(screen.getByRole("tab", { name: /funcionamientos/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByText(/para qué sirve chronicle/i)).toBeInTheDocument();
    expect(screen.getByText(/el flujo en 6 pasos/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. definí los campos/i)).toBeInTheDocument();
    expect(screen.getByText(/6\. generá la crónica/i)).toBeInTheDocument();
    expect(screen.getByText(/compartir y mover datos/i)).toBeInTheDocument();
    expect(screen.getByText(/funciona sin internet/i)).toBeInTheDocument();
  });

  it("hides the 'antes de arrancar' next-step card on the funcionamientos tab", () => {
    renderHelp();

    expect(screen.queryByText(/antes de arrancar/i)).not.toBeInTheDocument();
  });

  it("renders the data storage content when ?tab=datos is active", () => {
    renderHelp("/help?tab=datos");

    expect(screen.getByRole("tab", { name: /^datos$/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/tus datos viven en este navegador/i)).toBeInTheDocument();
    expect(screen.getByText(/cuándo podés perder los datos/i)).toBeInTheDocument();
    expect(screen.getByText(/cómo cuidar tu trabajo/i)).toBeInTheDocument();
    expect(screen.getByText(/recomendaciones para el día a día/i)).toBeInTheDocument();
    expect(screen.getByText(/^privacidad$/i)).toBeInTheDocument();
  });

  it("renders the AI guide when ?tab=ia is active", () => {
    renderHelp("/help?tab=ia");

    expect(screen.getByRole("tab", { name: /^ia$/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/qué hace la generación con ia/i)).toBeInTheDocument();
    expect(screen.getByText(/privacidad y datos enviados/i)).toBeInTheDocument();
    expect(screen.getByText(/cómo obtener tu clave gratuita/i)).toBeInTheDocument();
  });

  it("hides the funcionamientos and IA content when the datos tab is active", () => {
    renderHelp("/help?tab=datos");

    expect(screen.queryByText(/para qué sirve chronicle/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/qué hace la generación con ia/i)).not.toBeInTheDocument();
  });

  it("hides the funcionamientos and datos content when the IA tab is active", () => {
    renderHelp("/help?tab=ia");

    expect(screen.queryByText(/para qué sirve chronicle/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tus datos viven en este navegador/i)).not.toBeInTheDocument();
  });

  it("falls back to the funcionamientos tab when ?tab= is unknown", () => {
    renderHelp("/help?tab=unknown");

    expect(screen.getByRole("tab", { name: /funcionamientos/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText(/para qué sirve chronicle/i)).toBeInTheDocument();
  });

  it("links to Settings from the backup section on the datos tab", () => {
    renderHelp("/help?tab=datos");

    expect(screen.getByRole("link", { name: /ir a configuración/i })).toHaveAttribute(
      "href",
      "/settings",
    );
  });

  it("links to fields, forms, projects, chronicles and settings from the funcionamientos tab", () => {
    renderHelp();

    expect(screen.getByRole("link", { name: /^ir a campos$/i })).toHaveAttribute("href", "/fields");
    expect(screen.getByRole("link", { name: /^ir a formularios$/i })).toHaveAttribute(
      "href",
      "/forms",
    );
    expect(screen.getAllByRole("link", { name: /^ir a proyectos$/i })[0]).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: /^ir a crónicas$/i })).toHaveAttribute(
      "href",
      "/chronicles",
    );
    expect(screen.getByRole("link", { name: /^ir a configuración$/i })).toHaveAttribute(
      "href",
      "/settings",
    );
  });
});
