import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";

import { RootLayout } from "@/app/layout";
import { ThemeProvider } from "@/app/theme";
import { onboardingStorageKey } from "@/features/onboarding/services/onboarding-service";

function renderApp() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <ThemeProvider>
            <RootLayout />
          </ThemeProvider>
        ),
        children: [{ index: true, element: <p>Home</p> }],
      },
    ],
    { initialEntries: ["/"] },
  );

  render(<RouterProvider router={router} />);
}

function getDialog(): HTMLElement {
  return screen.getByRole("dialog", { name: /cómo funciona chronicle/i });
}

describe("OnboardingDialog", () => {
  beforeEach(() => {
    window.localStorage.removeItem(onboardingStorageKey);
  });

  it("opens automatically on first visit and shows the first step", () => {
    renderApp();

    const dialog = getDialog();
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/paso 1 de 2/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/para qué sirve chronicle/i)).toBeInTheDocument();
  });

  it("navigates to the second step and finishes, persisting the completion flag", async () => {
    const user = userEvent.setup();
    renderApp();

    const dialog = getDialog();
    expect(within(dialog).getByRole("button", { name: /anterior/i })).toBeDisabled();

    await user.click(within(dialog).getByRole("button", { name: /siguiente/i }));

    const dialogStep2 = screen.getByRole("dialog", { name: /cómo se guardan tus datos/i });
    expect(within(dialogStep2).getByText(/paso 2 de 2/i)).toBeInTheDocument();
    expect(within(dialogStep2).getByText(/tus datos viven en este navegador/i)).toBeInTheDocument();
    expect(within(dialogStep2).getByRole("button", { name: /anterior/i })).toBeEnabled();

    await user.click(
      within(dialogStep2).getByRole("button", { name: /empezar a usar chronicle/i }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.localStorage.getItem(onboardingStorageKey)).toBe("true");
  });

  it("can skip the tutorial and persists the completion flag", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(within(getDialog()).getByRole("button", { name: /saltar tutorial/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.localStorage.getItem(onboardingStorageKey)).toBe("true");
  });

  it("does not open if onboarding was already completed", () => {
    window.localStorage.setItem(onboardingStorageKey, "true");

    renderApp();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
