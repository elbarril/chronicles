import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

import { RootLayout } from "@/app/layout";
import { ThemeProvider } from "@/app/theme";
import { HowItWorksPage } from "@/features/help/HowItWorksPage";

function renderHowItWorks() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <ThemeProvider>
            <RootLayout />
          </ThemeProvider>
        ),
        children: [{ path: "how-it-works", element: <HowItWorksPage /> }],
      },
    ],
    { initialEntries: ["/how-it-works"] },
  );

  render(<RouterProvider router={router} />);
}

describe("How it works route", () => {
  it("renders the page heading", () => {
    renderHowItWorks();

    expect(
      screen.getByRole("heading", { name: /cómo funciona chronicle/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders the workflow steps and the share, offline and next-step sections", () => {
    renderHowItWorks();

    expect(screen.getByText(/para qué sirve chronicle/i)).toBeInTheDocument();
    expect(screen.getByText(/el flujo en 6 pasos/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. definí los campos/i)).toBeInTheDocument();
    expect(screen.getByText(/6\. generá la crónica/i)).toBeInTheDocument();
    expect(screen.getByText(/compartir y mover datos/i)).toBeInTheDocument();
    expect(screen.getByText(/funciona sin internet/i)).toBeInTheDocument();
    expect(screen.getByText(/antes de arrancar/i)).toBeInTheDocument();
  });

  it("links to fields, forms, groups, encounters, chronicles, settings and help", () => {
    renderHowItWorks();

    expect(screen.getByRole("link", { name: /^ir a campos$/i })).toHaveAttribute("href", "/fields");
    expect(screen.getByRole("link", { name: /^ir a formularios$/i })).toHaveAttribute(
      "href",
      "/forms",
    );
    expect(screen.getByRole("link", { name: /^ir a grupos$/i })).toHaveAttribute("href", "/groups");
    expect(screen.getByRole("link", { name: /^ir a encuentros$/i })).toHaveAttribute(
      "href",
      "/encounters",
    );
    expect(screen.getByRole("link", { name: /^ir a crónicas$/i })).toHaveAttribute(
      "href",
      "/chronicles",
    );
    // Post-F8: import lives at /settings; the share section now links there.
    expect(screen.getByRole("link", { name: /^ir a configuración$/i })).toHaveAttribute(
      "href",
      "/settings",
    );
    expect(screen.getByRole("link", { name: /^cómo se guardan tus datos$/i })).toHaveAttribute(
      "href",
      "/help",
    );
  });
});
