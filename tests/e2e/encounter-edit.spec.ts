import { expect, test } from "@playwright/test";

test("can edit an encounter — name, times, and attendees", async ({ page }) => {
  const suffix = Date.now().toString();
  const projectName = `Proyecto Editar ${suffix}`;
  const originalName = `Sesión original ${suffix}`;
  const editedName = `Sesión editada ${suffix}`;

  // 1. Create a project with two participants so we can toggle attendance.
  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(projectName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Agregar participante" }).click();
  await page.getByPlaceholder("Participante 2").fill("Bruno");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  // 2. Create an encounter where only Sofía attends.
  await page.getByRole("link", { name: "Crear encuentro" }).click();
  await page.getByLabel("Nombre del encuentro").fill(originalName);
  await page.getByLabel(/^Sofía$/).check();
  await page.getByRole("button", { name: "Crear encuentro" }).click();

  await expect(page.getByRole("heading", { name: originalName })).toBeVisible();

  // 3. Header shows Sofía as an attendee chip but not Bruno.
  const attendees = page.getByLabel("Lista de asistentes");
  await expect(attendees.getByText("Sofía")).toBeVisible();
  await expect(attendees.getByText("Bruno")).toHaveCount(0);

  // 4. Open the edit page from the header button.
  await page.getByRole("link", { name: "Editar encuentro" }).click();
  await expect(page).toHaveURL(/\/encounters\/.+\/edit$/);
  await expect(page.getByRole("heading", { name: "Editar encuentro" })).toBeVisible();

  // 5. Rename the encounter, add Bruno, and save.
  await page.getByLabel("Nombre del encuentro").fill(editedName);
  await page.getByLabel(/^Bruno$/).check();
  await page.getByRole("button", { name: "Guardar cambios" }).click();

  // 6. Back to the detail page with the new name + both attendees as chips.
  await expect(page.getByRole("heading", { name: editedName })).toBeVisible();
  const updatedAttendees = page.getByLabel("Lista de asistentes");
  await expect(updatedAttendees.getByText("Sofía")).toBeVisible();
  await expect(updatedAttendees.getByText("Bruno")).toBeVisible();
});

test("editing the project preserves the participant ids referenced by encounters", async ({
  page,
}) => {
  const suffix = Date.now().toString();
  const projectName = `Proyecto Identidad ${suffix}`;
  const renamedProject = `Proyecto Identidad Renombrado ${suffix}`;
  const encounterName = `Sesión ${suffix}`;

  // 1. Create the project + encounter.
  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(projectName);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  await page.getByRole("link", { name: "Crear encuentro" }).click();
  await page.getByLabel("Nombre del encuentro").fill(encounterName);
  await page.getByLabel(/^Sofía$/).check();
  await page.getByRole("button", { name: "Crear encuentro" }).click();
  await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();
  await expect(page.getByLabel("Lista de asistentes").getByText("Sofía")).toBeVisible();

  // 2. Edit the project (rename + leave participants intact). Before the
  //    fix, this regenerated every participant uuid and broke the
  //    encounter's attendee list.
  await page.getByRole("link", { name: "Proyectos" }).first().click();
  await page.getByRole("link", { name: projectName }).first().click();
  await page.getByRole("link", { name: "Editar proyecto" }).click();
  await page.getByLabel("Nombre del proyecto").fill(renamedProject);
  await page.getByRole("button", { name: "Guardar proyecto" }).click();
  await expect(page.getByRole("heading", { name: renamedProject })).toBeVisible();

  // 3. Re-open the encounter and confirm Sofía still shows up as an
  //    attendee chip — i.e. her id survived the project edit.
  await page.getByRole("link", { name: encounterName }).first().click();
  await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();
  await expect(page.getByLabel("Lista de asistentes").getByText("Sofía")).toBeVisible();
});
