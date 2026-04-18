import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

import { RootLayout } from "@/app/layout";
import { HomePage } from "@/features/home/HomePage";

describe("Home route", () => {
  it("renders the welcome heading", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <RootLayout />,
          children: [{ index: true, element: <HomePage /> }],
        },
      ],
      { initialEntries: ["/"] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("heading", { name: /bienvenido a chronicle/i })).toBeInTheDocument();
  });
});
