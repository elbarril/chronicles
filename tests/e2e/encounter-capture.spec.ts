import { expect, test } from "@playwright/test";

test("can create encounter and capture multiple observations with media files", async ({
  page,
}) => {
  const suffix = Date.now().toString();
  const groupName = `Grupo Encuentro ${suffix}`;
  const textFieldName = `Nota ${suffix}`;
  const imageFieldName = `Foto ${suffix}`;
  const audioFieldName = `Audio ${suffix}`;
  const textFieldKey = `nota_${suffix}`;
  const imageFieldKey = `foto_${suffix}`;
  const audioFieldKey = `audio_${suffix}`;
  const formName = `Formulario Encuentro ${suffix}`;

  await page.goto("/groups/new");
  await page.getByLabel("Nombre del grupo").fill(groupName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Guardar grupo" }).click();
  await expect(page.getByRole("heading", { name: "Grupos" })).toBeVisible();

  await page.goto("/fields/new");
  await page.getByLabel("Nombre del campo").fill(textFieldName);
  await page.getByLabel("Clave técnica").fill(textFieldKey);
  await page.getByLabel("Tipo").selectOption("text");
  await page.getByRole("button", { name: "Guardar campo" }).click();
  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  await expect(page.getByRole("cell", { name: textFieldName })).toBeVisible();

  await page.goto("/fields/new");
  await page.getByLabel("Nombre del campo").fill(imageFieldName);
  await page.getByLabel("Clave técnica").fill(imageFieldKey);
  await page.getByLabel("Tipo").selectOption("image");
  await page.getByRole("button", { name: "Guardar campo" }).click();
  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  await expect(page.getByRole("cell", { name: imageFieldName })).toBeVisible();

  await page.goto("/fields/new");
  await page.getByLabel("Nombre del campo").fill(audioFieldName);
  await page.getByLabel("Clave técnica").fill(audioFieldKey);
  await page.getByLabel("Tipo").selectOption("audio");
  await page.getByRole("button", { name: "Guardar campo" }).click();
  await expect(page.getByRole("heading", { name: "Campos" })).toBeVisible();
  await expect(page.getByRole("cell", { name: audioFieldName })).toBeVisible();

  await page.goto("/forms/new");
  await page.getByLabel("Nombre del formulario").fill(formName);

  const availableFieldsPanel = page.locator("div", { hasText: "Campos disponibles" }).first();
  await availableFieldsPanel
    .locator("li", { hasText: textFieldName })
    .getByRole("button", { name: "Agregar" })
    .click();
  await availableFieldsPanel
    .locator("li", { hasText: imageFieldName })
    .getByRole("button", { name: "Agregar" })
    .click();
  await availableFieldsPanel
    .locator("li", { hasText: audioFieldName })
    .getByRole("button", { name: "Agregar" })
    .click();

  await page.getByRole("button", { name: "Guardar formulario" }).click();
  await expect(page.getByRole("heading", { name: "Formularios" })).toBeVisible();

  await page.goto("/encounters/new");
  await page.getByLabel("Actividad").fill(`Actividad ${suffix}`);
  await page.getByLabel("Grupo").selectOption({ label: groupName });
  await page.getByLabel("Formulario").selectOption({ label: `${formName} (v1)` });
  await page.getByRole("button", { name: "Crear encuentro" }).click();

  await expect(page.getByRole("heading", { name: /Actividad/ })).toBeVisible();

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel(new RegExp(textFieldName)).fill("Primera observación");
  await page.getByRole("button", { name: "Guardar observación" }).click();

  await expect(page.getByText("Primera observación")).toBeVisible();

  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel(new RegExp(textFieldName)).fill("Segunda observación");

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

  await expect(page.getByText("Segunda observación")).toBeVisible();
  await expect(page.getByRole("img", { name: imageFieldName })).toBeVisible();
  await expect(page.getByLabel(`Reproducir ${audioFieldName}`)).toBeVisible();

  await page.getByRole("button", { name: "Finalizar encuentro" }).click();
  await expect(page.getByText("Encuentro finalizado", { exact: true })).toBeVisible();
});
