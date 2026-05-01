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

  it("renders the quick check section with a single action button", () => {
    renderHome();

    expect(screen.getByText(/chequeo rápido del formulario/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /probar setup/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("renders the data status section", () => {
    renderHome();

    expect(screen.getByText(/estado de datos/i)).toBeInTheDocument();
  });
});
