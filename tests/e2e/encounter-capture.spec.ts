import { expect, test } from "@playwright/test";

test("can register a post-event encounter and capture observations with media", async ({
  page,
}) => {
  const suffix = Date.now().toString();
  const projectName = `Proyecto Encuentro ${suffix}`;
  const textFieldName = `Nota ${suffix}`;
  const imageFieldName = `Foto ${suffix}`;
  const audioFieldName = `Audio ${suffix}`;
  const formName = `Formulario Encuentro ${suffix}`;
  const encounterName = `Sesión ${suffix}`;

  // Create project with one participant
  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(projectName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  // Create three fields
  for (const [fieldName, fieldType] of [
    [textFieldName, "text"],
    [imageFieldName, "image"],
    [audioFieldName, "audio"],
  ] as const) {
    await page.goto("/fields/new");
    await page.getByLabel("Nombre del campo").fill(fieldName);
    await page.getByLabel("Tipo").selectOption(fieldType);
    await page.getByRole("button", { name: "Guardar campo" }).click();
    await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  }

  // Create form combining the three fields
  await page.goto("/forms/new");
  await page.getByLabel("Nombre del formulario").fill(formName);
  const availableFieldsPanel = page.locator("div", { hasText: "Campos disponibles" }).first();
  for (const fieldName of [textFieldName, imageFieldName, audioFieldName]) {
    await availableFieldsPanel
      .locator("li", { hasText: fieldName })
      .locator("button").first()
      .click();
  }
  await page.getByRole("button", { name: "Guardar formulario" }).click();
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();

  // Open project and create encounter
  await page.goto("/projects");
  await page.getByRole("link", { name: projectName }).first().click();
  await page.getByRole("link", { name: "Crear encuentro" }).click();

  await page.getByLabel("Nombre del encuentro").fill(encounterName);
  await page.getByLabel(/^Sofía$/).check();
  await page.getByRole("button", { name: "Crear encuentro" }).click();

  await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

  // Create observation with form selector
  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel("Formulario").selectOption({ label: formName });
  await page.getByLabel(new RegExp(textFieldName)).fill("Primera observación");

  const fileInputs = page.locator('input[type="file"]');
  await fileInputs.nth(0).setInputFiles({
    name: "photo.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9H9LwAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await fileInputs.nth(1).setInputFiles({
    name: "audio.webm",
    mimeType: "audio/webm",
    buffer: Buffer.from("GkXfo59ChoEBQveBAULygQRC84EIQvOBAELzgQhC84E=", "base64"),
  });

  await page.getByRole("button", { name: "Guardar observación" }).click();

  await expect(page.getByText("Primera observación")).toBeVisible();

  // The "Ver crónica" link is the only entry point to chronicle generation now.
  await page.getByRole("link", { name: "Ver crónica" }).click();
  await expect(page.getByRole("heading", { name: "Crónica del encuentro" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Generar crónica/i })).toBeVisible();
});
