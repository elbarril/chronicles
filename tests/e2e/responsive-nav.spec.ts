import { expect, test } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 390, height: 664 } as const;
const TABLET_PORTRAIT_VIEWPORT = { width: 768, height: 1024 } as const;

test.describe("responsive navigation - mobile (iPhone 13 size)", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test("hamburger drawer opens, navigates and closes", async ({ page }) => {
    await page.goto("/");

    const hamburger = page.getByRole("button", { name: "Abrir menú de navegación" });
    await expect(hamburger).toBeVisible();

    await hamburger.click();

    const drawerHeading = page.getByRole("heading", { name: "Navegación" });
    await expect(drawerHeading).toBeVisible();

    await page.getByRole("link", { name: "Campos" }).click();

    await expect(page).toHaveURL(/\/fields$/);
    await expect(drawerHeading).toBeHidden();
    await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  });

  test("drawer closes with Escape", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Abrir menú de navegación" }).click();

    const drawerHeading = page.getByRole("heading", { name: "Navegación" });
    await expect(drawerHeading).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(drawerHeading).toBeHidden();
  });
});

test.describe("responsive navigation - tablet portrait (iPad Mini size)", () => {
  test.use({ viewport: TABLET_PORTRAIT_VIEWPORT });

  test("shows hamburger menu below the lg breakpoint", async ({ page }) => {
    await page.goto("/");

    const hamburger = page.getByRole("button", { name: "Abrir menú de navegación" });
    await expect(hamburger).toBeVisible();

    await hamburger.click();

    await expect(page.getByRole("heading", { name: "Navegación" })).toBeVisible();
  });
});

test.describe("responsive navigation - desktop (default viewport)", () => {
  test("home page renders the nav hub grid and the hamburger trigger remains available", async ({
    page,
  }) => {
    await page.goto("/");

    // The home page itself acts as the desktop nav hub: a grid of links
    // that point to every top-level section.
    const hubNav = page.getByRole("navigation", { name: "Accesos directos a secciones" });
    await expect(hubNav).toBeVisible();
    await expect(hubNav.getByRole("link", { name: "Campos" })).toBeVisible();
    await expect(hubNav.getByRole("link", { name: "Configuración" })).toBeVisible();

    // The hamburger trigger is the single navigation surface across all
    // breakpoints (no separate inline desktop nav anymore).
    await expect(page.getByRole("button", { name: "Abrir menú de navegación" })).toBeVisible();
  });
});
