import { expect, test } from "@playwright/test";

test("can create, edit, archive and restore a group", async ({ page }) => {
  const suffix = Date.now().toString();
  const groupName = `Sala Azul ${suffix}`;
  const editedGroupName = `Sala Verde ${suffix}`;

  await page.goto("/groups");
  await expect(page.getByRole("heading", { name: "Grupos" })).toBeVisible();

  await page.getByRole("link", { name: "Nuevo grupo" }).click();
  await expect(page.getByRole("heading", { name: "Nuevo grupo" })).toBeVisible();

  await page.getByLabel("Nombre del grupo").fill(groupName);
  await page.getByPlaceholder("Participante 1").fill("Ana");
  await page.getByRole("button", { name: "Agregar participante" }).click();
  await page.getByPlaceholder("Participante 2").fill("Bruno");
  await page.getByRole("button", { name: "Guardar grupo" }).click();

  await expect(page.getByRole("heading", { name: "Grupos" })).toBeVisible();
  await expect(page.getByRole("cell", { name: groupName })).toBeVisible();

  await page.getByRole("link", { name: "Editar" }).first().click();
  await expect(page.getByRole("heading", { name: "Editar grupo" })).toBeVisible();
  await page.getByLabel("Nombre del grupo").fill(editedGroupName);
  await page.getByRole("button", { name: "Guardar grupo" }).click();

  await expect(page.getByRole("cell", { name: editedGroupName })).toBeVisible();

  await page.getByRole("button", { name: "Archivar" }).first().click();
  await page.getByRole("button", { name: "Archivados" }).click();
  await expect(page.getByRole("cell", { name: editedGroupName })).toBeVisible();

  await page.getByRole("button", { name: "Restaurar" }).first().click();
  await page.getByRole("button", { name: "Activos" }).click();
  await expect(page.getByRole("cell", { name: editedGroupName })).toBeVisible();
});
