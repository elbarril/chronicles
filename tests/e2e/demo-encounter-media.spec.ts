import { expect, test } from "@playwright/test";

test("demo encounter ships pre-populated with all field types and chronicle ready", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Cargar encuentro de prueba" }).click();

  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+/i);
  await expect(page.getByRole("heading", { name: "Actividad de prueba" })).toBeVisible();

  // Scalar values for every supported type render in the timeline (label
  // + formatted value via the new fields-aware EncounterTimeline).
  await expect(page.getByText("Texto corto de ejemplo.")).toBeVisible();
  await expect(page.getByText(/Esta es una descripción larga/)).toBeVisible();
  await expect(page.getByText("42")).toBeVisible();
  // Booleans are translated to rioplatense labels rather than printed as JS literals.
  await expect(page.getByText("Verdadero", { exact: true })).toBeVisible();
  await expect(page.getByText("Opción A", { exact: true })).toBeVisible();
  await expect(page.getByText("Verde, Azul")).toBeVisible();
  // Dates and datetimes render via Intl.DateTimeFormat("es-AR", ...) so they
  // match the rest of the app (e.g. chronicle "Generada" timestamps).
  await expect(page.getByText("30/4/26", { exact: true })).toBeVisible();
  await expect(page.getByText("10:30", { exact: true })).toBeVisible();
  await expect(page.getByText(/^30\/4\/26.*10:30/)).toBeVisible();
  await expect(page.getByText("4", { exact: true })).toBeVisible();
  await expect(page.getByText("Ciudad Autónoma de Buenos Aires")).toBeVisible();

  // Media for every supported type is rendered with managed object URLs.
  await expect(page.getByLabel("Reproducir Audio")).toBeVisible();
  await expect(page.getByLabel("Reproducir Video")).toBeVisible();
  await expect(page.getByRole("img", { name: "Imagen" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Descargar Archivo" })).toBeVisible();

  // The chronicle was pre-generated, so the encounter detail's "Generar
  // crónica" action should jump straight to the existing chronicle.
  await page.getByRole("button", { name: "Generar crónica" }).click();
  await expect(page).toHaveURL(/\/chronicles\/[0-9a-f-]+/i);

  await expect(page.getByText("Crónica · Actividad de prueba")).toBeVisible();
  await expect(page.getByText("Material multimedia del encuentro")).toBeVisible();

  // Chronicle body contains content from every scalar type.
  await expect(page.getByText(/Texto corto de ejemplo\./)).toBeVisible();
  await expect(page.getByText(/Opción A/)).toBeVisible();
  await expect(page.getByText(/Ciudad Autónoma de Buenos Aires/)).toBeVisible();

  // Chronicle media panel renders all four media types reproducible.
  await expect(page.getByLabel("Reproducir Audio")).toBeVisible();
  await expect(page.getByLabel("Reproducir Video")).toBeVisible();
  await expect(page.getByRole("img", { name: "Imagen" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Descargar Archivo" })).toBeVisible();
});

test("'Cargar encuentro de prueba' lives only on the home page", async ({ page }) => {
  // Without demo content, only the home shows the create button.
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Cargar encuentro de prueba" }),
  ).toBeVisible();

  for (const path of ["/fields", "/forms", "/groups", "/encounters", "/chronicles"]) {
    await page.goto(path);
    await expect(
      page.getByRole("button", { name: "Cargar encuentro de prueba" }),
    ).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Eliminar contenido de prueba" }),
    ).toBeHidden();
  }

  // Create the demo from the home toggle.
  await page.goto("/");
  await page.getByRole("button", { name: "Cargar encuentro de prueba" }).click();
  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+/i);

  // Once the demo exists, the home toggle flips to "Eliminar" and the
  // create entry point disappears across the app.
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Eliminar contenido de prueba" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cargar encuentro de prueba" }),
  ).toBeHidden();

  // Every list page that renders demo content surfaces the destructive
  // twin and never offers the create button.
  for (const path of ["/fields", "/forms", "/groups", "/encounters", "/chronicles"]) {
    await page.goto(path);
    await expect(
      page.getByRole("button", { name: "Eliminar contenido de prueba" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Cargar encuentro de prueba" }),
    ).toBeHidden();
  }
});

test("delete demo content from any list page restores the create button", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Cargar encuentro de prueba" }).click();
  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+/i);

  // Pick anchors that are unique to demo content so locators stay stable
  // even though several demo field labels collide with the field-type
  // column ("Texto corto", "Imagen", "Audio", etc.).
  await page.goto("/fields");
  await expect(page.getByRole("cell", { name: "Booleano", exact: true })).toBeVisible();

  await page.goto("/forms");
  await expect(page.getByRole("cell", { name: "Formulario de prueba" })).toBeVisible();

  await page.goto("/groups");
  await expect(page.getByRole("cell", { name: "Grupo de prueba" })).toBeVisible();

  await page.goto("/encounters?status=inProgress");
  await expect(page.getByRole("cell", { name: "Actividad de prueba" })).toBeVisible();

  await page.goto("/chronicles");
  await expect(page.getByRole("link", { name: "Crónica · Actividad de prueba" })).toBeVisible();

  // Delete from the chronicles list — the toggle button now reads "Eliminar".
  await page.getByRole("button", { name: "Eliminar contenido de prueba" }).click();

  await expect(
    page.getByRole("link", { name: "Crónica · Actividad de prueba" }),
  ).toBeHidden();

  await page.goto("/encounters?status=inProgress");
  await expect(page.getByRole("cell", { name: "Actividad de prueba" })).toBeHidden();

  await page.goto("/groups");
  await expect(page.getByRole("cell", { name: "Grupo de prueba" })).toBeHidden();

  await page.goto("/forms");
  await expect(page.getByRole("cell", { name: "Formulario de prueba" })).toBeHidden();

  await page.goto("/fields");
  await expect(page.getByRole("cell", { name: "Booleano", exact: true })).toBeHidden();

  // The home toggle is back to "Cargar" — pressing it re-creates everything.
  await page.goto("/");
  await page.getByRole("button", { name: "Cargar encuentro de prueba" }).click();
  await expect(page).toHaveURL(/\/encounters\/[0-9a-f-]+/i);
  await expect(page.getByRole("heading", { name: "Actividad de prueba" })).toBeVisible();
});
