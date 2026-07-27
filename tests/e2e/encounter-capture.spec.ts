import { expect, test } from "@playwright/test";

test("can register a post-event encounter and capture observations with media", async ({
  page,
}) => {
  const suffix = Date.now().toString();
  const projectName = `Proyecto Encuentro ${suffix}`;
  const formName = "Observación de encuentro";
  const encounterName = `Sesión ${suffix}`;

  // Reuse the seeded default form ("Audio de observación" + "Transcripción de
  // audio de observación") so the test exercises media (audio) + text capture
  // without authoring fields/forms manually. After the F11 merge,
  // field authoring is covered by fields-from-form-builder.spec.ts.
  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(projectName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  // Open project and create encounter
  await page.goto("/projects");
  await page.getByRole("link", { name: projectName }).first().click();
  await page.getByRole("link", { name: "Crear encuentro" }).click();

  await page.getByLabel("Nombre del encuentro").fill(encounterName);
  await page.getByLabel(/^Sofía$/).check();
  await page.getByRole("button", { name: "Crear encuentro" }).click();

  await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

  // The attendee chip list shows everyone who attended the encounter.
  await expect(page.getByLabel("Lista de asistentes").getByText("Sofía")).toBeVisible();

  // Create observation with form selector
  await page.getByRole("button", { name: "Nueva observación" }).click();
  await page.getByLabel("Formulario").selectOption({ label: formName });
  await page.getByLabel(/Transcripción de audio de observación/).fill("Primera observación");

  // Default form has a single audio field, so we expect a single file input.
  await page
    .locator('input[type="file"]')
    .first()
    .setInputFiles({
      name: "audio.webm",
      mimeType: "audio/webm",
      buffer: Buffer.from("GkXfo59ChoEBQveBAULygQRC84EIQvOBAELzgQhC84E=", "base64"),
    });

  await page.getByRole("button", { name: "Guardar observación" }).click();

  // Wait for the observation dialog to fully close before asserting
  // the saved value renders in the encounter timeline. Otherwise the
  // textarea (which keeps "Primera observación" as its text content
  // until Radix unmounts the dialog) still matches by text.
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(
    page.getByLabel("Observaciones del encuentro").getByText("Primera observación"),
  ).toBeVisible();

  // The "Ver crónica" link is the only entry point to chronicle generation now.
  await page.getByRole("link", { name: "Ver crónica" }).click();
  await expect(page.getByRole("heading", { name: "Crónica del encuentro" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Generar crónica/i })).toBeVisible();
});
