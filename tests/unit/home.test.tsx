import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

import { RootLayout } from "@/app/layout";
import { ThemeProvider } from "@/app/theme";
import { HomePage } from "@/features/home/HomePage";

function renderHome() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <ThemeProvider>
            <RootLayout />
          </ThemeProvider>
        ),
        children: [{ index: true, element: <HomePage /> }],
      },
    ],
    { initialEntries: ["/"] },
  );

  render(<RouterProvider router={router} />);
}

describe("Home route", () => {
  it("renders the welcome heading", () => {
    renderHome();

    expect(screen.getByRole("heading", { name: /bienvenido a chronicle/i })).toBeInTheDocument();
  });

  it("renders the navigation grid with all section links", () => {
    renderHome();

    const nav = screen.getByRole("navigation", { name: /accesos directos a secciones/i });
    expect(nav).toBeInTheDocument();

    // Each nav section should render as a link
    expect(screen.getAllByRole("link", { name: /formularios/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /proyectos/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /crónicas/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /configuración/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /soporte/i }).length).toBeGreaterThan(0);
  });

  it("does not include the legacy Grupos, Encuentros or Campos tiles", () => {
    renderHome();

    const grid = screen.getByRole("navigation", { name: /accesos directos a secciones/i });
    expect(grid).not.toHaveTextContent(/^Grupos$/m);
    expect(grid).not.toHaveTextContent(/^Encuentros$/m);
    expect(grid).not.toHaveTextContent(/^Campos$/m);
  });

  it("nav links point to the correct routes", () => {
    renderHome();

    const linksToProjects = screen.getAllByRole("link", { name: /proyectos/i });
    const homeProjectsLink = linksToProjects.find(
      (link) => link.getAttribute("data-tour") === "hub.projects",
    );

    expect(homeProjectsLink).toHaveAttribute("href", "/projects");
  });
});
