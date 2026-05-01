import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

import { RootLayout } from "@/app/layout";
import { ThemeProvider } from "@/app/theme";
import { HelpPage } from "@/features/help/HelpPage";

function renderHelp() {
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
    { initialEntries: ["/help"] },
  );

  render(<RouterProvider router={router} />);
}

describe("Help route", () => {
  it("renders the page heading", () => {
    renderHelp();

    expect(
      screen.getByRole("heading", { name: /cómo se guardan tus datos/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders the storage, risk, backup, recommendations and privacy sections", () => {
    renderHelp();

    expect(screen.getByText(/tus datos viven en este navegador/i)).toBeInTheDocument();
    expect(screen.getByText(/cuándo podés perder los datos/i)).toBeInTheDocument();
    expect(screen.getByText(/cómo cuidar tu trabajo/i)).toBeInTheDocument();
    expect(screen.getByText(/recomendaciones para el día a día/i)).toBeInTheDocument();
    expect(screen.getByText(/^privacidad$/i)).toBeInTheDocument();
  });

  it("links to Settings from the backup section (single canonical export/import surface post-F8)", () => {
    renderHelp();

    expect(screen.getByRole("link", { name: /ir a configuración/i })).toHaveAttribute(
      "href",
      "/settings",
    );
  });
});
