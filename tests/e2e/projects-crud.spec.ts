import { expect, test } from "@playwright/test";

test("can create, edit, archive and restore a project", async ({ page }) => {
  const suffix = Date.now().toString();
  const name = `Proyecto ${suffix}`;

  await page.goto("/projects/new");
  await page.getByLabel("Nombre del proyecto").fill(name);
  await page.getByPlaceholder("Participante 1").fill("Sofía");
  await page.getByRole("button", { name: "Agregar participante" }).click();
  await page.getByPlaceholder("Participante 2").fill("Iván");
  await page.getByRole("button", { name: "Guardar proyecto" }).click();

  await expect(page.getByRole("heading", { name: name })).toBeVisible();

  // Edit the project
  await page.getByRole("link", { name: "Editar proyecto" }).click();
  await expect(page.getByRole("heading", { name: "Editar proyecto" })).toBeVisible();
  await page.getByLabel("Nombre del proyecto").fill(`${name} editado`);
  await page.getByRole("button", { name: "Guardar proyecto" }).click();

  await expect(page.getByRole("heading", { name: `${name} editado` })).toBeVisible();

  // Archive — keeps you on the project detail page
  await page.getByRole("button", { name: "Archivar proyecto" }).click();
  await expect(page.getByText("Archivado", { exact: true })).toBeVisible();

  // The archived list should now contain the project
  await page.goto("/projects?status=archived");
  await expect(page.getByRole("heading", { name: "Proyectos" })).toBeVisible();
  await expect(page.getByRole("link", { name: `${name} editado` }).first()).toBeAttached();

  // Restore from list
  await page.getByRole("button", { name: "Restaurar" }).first().click();
});
