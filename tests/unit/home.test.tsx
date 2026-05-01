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
    expect(screen.getByRole("link", { name: /campos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /formularios/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /grupos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /encuentros/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /crónicas/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /configuración/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /soporte/i })).toBeInTheDocument();
  });

  it("nav links point to the correct routes", () => {
    renderHome();

    expect(screen.getByRole("link", { name: /campos/i })).toHaveAttribute("href", "/fields");
    expect(screen.getByRole("link", { name: /grupos/i })).toHaveAttribute("href", "/groups");
    expect(screen.getByRole("link", { name: /configuración/i })).toHaveAttribute(
      "href",
      "/settings",
    );
    expect(screen.getByRole("link", { name: /soporte/i })).toHaveAttribute("href", "/support");
  });
});
