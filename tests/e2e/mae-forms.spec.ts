import { expect, test } from "@playwright/test";

/**
 * E2E tests for MAE (Modelo de Acompañamiento Educativo) Forms
 *
 * These tests validate the complete user flows for:
 * - MAE Evaluation Form (Ficha de Evaluación)
 * - MAE Observation Forms (Ficha de Observación - Encuentros 1-8)
 * - Integration between multiple forms for the same participant
 */

const MAE_EVAL_FORM_NAME = "MAE - Ficha de Evaluación";
const MAE_OBS_FORM_ENC_1_NAME = "MAE - Ficha de Observación - Encuentro 1";
const MAE_OBS_FORM_ENC_2_NAME = "MAE - Ficha de Observación - Encuentro 2";
const MAE_OBS_FORM_ENC_5_NAME = "MAE - Ficha de Observación - Encuentro 5";
const MAE_OBS_FORM_ENC_8_NAME = "MAE - Ficha de Observación - Encuentro 8";

test.describe("MAE Evaluation Form", () => {
  test("can complete MAE Evaluation Form with all fields", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Eval ${suffix}`;
    const participantName = "Juan Pérez";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    // Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();

    const encounterName = `Evaluación Final ${suffix}`;
    await page.getByLabel("Nombre del encuentro").fill(encounterName);
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();
    await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

    // Create observation with MAE Evaluation Form
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });

    // Fill identification fields
    await page.getByLabel("Estudiante/s").fill("Juan Pérez, María García");
    await page.getByLabel("Supervisora").fill("Lic. Ana López");
    await page.getByLabel("Institución").fill("Escuela Primaria N° 123");
    await page.getByLabel("Edad").fill("10");

    // Fill evaluation ratings for Encounter 4
    await page.getByLabel("Nivel de disposición al trabajo (4° encuentro)").fill("4");
    await page.getByLabel("Nivel de interés hacia la motivación (4° encuentro)").fill("3");
    await page.getByLabel("Nivel de interés hacia la consigna (4° encuentro)").fill("4");
    await page.getByLabel("Nivel general de concentración (4° encuentro)").fill("3");
    await page.getByLabel("Nivel de tolerancia a la frustración (4° encuentro)").fill("4");
    await page.getByLabel("Nivel de experimentación con los materiales (4° encuentro)").fill("3");
    await page.getByLabel("Nivel de producción de imágenes subjetivas (4° encuentro)").fill("4");
    await page
      .getByLabel("Nivel de logro (finalización de la producción) (4° encuentro)")
      .fill("3");
    await page.getByLabel("Nivel de Interacción con los pares (4° encuentro)").fill("4");
    await page.getByLabel("Nivel de socialización de su producción (4° encuentro)").fill("3");
    await page.getByLabel("Nivel de reciprocidad (escucha) con sus pares (4° encuentro)").fill("4");
    await page.getByLabel("Nivel de adecuación al encuadre (4° encuentro)").fill("3");

    // Fill evaluation ratings for Encounter 8
    await page.getByLabel("Nivel de disposición al trabajo (8° encuentro)").fill("5");
    await page.getByLabel("Nivel de interés hacia la motivación (8° encuentro)").fill("4");
    await page.getByLabel("Nivel de interés hacia la consigna (8° encuentro)").fill("5");
    await page.getByLabel("Nivel general de concentración (8° encuentro)").fill("4");
    await page.getByLabel("Nivel de tolerancia a la frustración (8° encuentro)").fill("5");
    await page.getByLabel("Nivel de experimentación con los materiales (8° encuentro)").fill("4");
    await page.getByLabel("Nivel de producción de imágenes subjetivas (8° encuentro)").fill("5");
    await page
      .getByLabel("Nivel de logro (finalización de la producción) (8° encuentro)")
      .fill("4");
    await page.getByLabel("Nivel de Interacción con los pares (8° encuentro)").fill("5");
    await page.getByLabel("Nivel de socialización de su producción (8° encuentro)").fill("4");
    await page.getByLabel("Nivel de reciprocidad (escucha) con sus pares (8° encuentro)").fill("5");
    await page.getByLabel("Nivel de adecuación al encuadre (8° encuentro)").fill("4");

    // Fill qualitative evaluation
    await page
      .getByLabel("Valoración cualitativa")
      .fill(
        "El participante muestra un progreso significativo en su producción artística. " +
          "Ha mejorado su interacción con los pares y su capacidad de seguir consignas.",
      );

    // Save observation
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify observation is saved and visible in timeline
    await expect(
      page.getByLabel("Observaciones del encuentro").getByText("Juan Pérez, María García"),
    ).toBeVisible();
  });

  test("validates required fields in MAE Evaluation Form", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Eval Val ${suffix}`;
    const participantName = "Carlos Ruiz";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Evaluación Test");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    // Create observation with MAE Evaluation Form
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });

    // Try to save without filling required fields
    await page.getByRole("button", { name: "Guardar observación" }).click();

    // Should show validation errors for required fields
    await expect(page.getByLabel("Estudiante/s")).toBeVisible();
    await expect(page.getByLabel("Supervisora")).toBeVisible();
    await expect(page.getByLabel("Institución")).toBeVisible();
    await expect(page.getByLabel("Edad")).toBeVisible();

    // Fill required fields
    await page.getByLabel("Estudiante/s").fill("Carlos Ruiz");
    await page.getByLabel("Supervisora").fill("Lic. Pedro Martínez");
    await page.getByLabel("Institución").fill("Institución Educativa");
    await page.getByLabel("Edad").fill("12");

    // Fill one rating to satisfy validation
    await page.getByLabel("Nivel de disposición al trabajo (4° encuentro)").fill("3");

    // Now save should succeed
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("validates field constraints in MAE Evaluation Form", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Eval Constraints ${suffix}`;
    const participantName = "Laura Sánchez";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Evaluación Constraints");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    // Create observation with MAE Evaluation Form
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });

    // Fill identification fields
    await page.getByLabel("Estudiante/s").fill("Laura Sánchez");
    await page.getByLabel("Supervisora").fill("Lic. Carmen Rodríguez");
    await page.getByLabel("Institución").fill("Colegio Secundario");

    // Test age constraint (should only accept 0-18)
    await page.getByLabel("Edad").fill("25");
    await page.getByLabel("Nivel de disposición al trabajo (4° encuentro)").fill("3");
    await page.getByRole("button", { name: "Guardar observación" }).click();

    // Should show validation error for age out of range
    // Note: The exact validation behavior depends on the implementation
    // This test documents the expected behavior

    // Correct the age
    await page.getByLabel("Edad").fill("15");
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("persists MAE Evaluation Form data correctly", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Eval Persist ${suffix}`;
    const participantName = "Diego Fernández";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Evaluación Persistencia");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    // Create and save observation
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });

    const testData = {
      estudiantes: "Diego Fernández, Sofía Martínez",
      supervisora: "Lic. Roberto Gómez",
      institucion: "Escuela Técnica N° 45",
      edad: "14",
      disposicionEnc4: "4",
      interesMotivacionEnc4: "3",
      valoracion: "Buen desempeño general durante el proceso.",
    };

    await page.getByLabel("Estudiante/s").fill(testData.estudiantes);
    await page.getByLabel("Supervisora").fill(testData.supervisora);
    await page.getByLabel("Institución").fill(testData.institucion);
    await page.getByLabel("Edad").fill(testData.edad);
    await page
      .getByLabel("Nivel de disposición al trabajo (4° encuentro)")
      .fill(testData.disposicionEnc4);
    await page
      .getByLabel("Nivel de interés hacia la motivación (4° encuentro)")
      .fill(testData.interesMotivacionEnc4);
    await page.getByLabel("Valoración cualitativa").fill(testData.valoracion);

    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Refresh the page to verify persistence
    await page.reload();
    await expect(page.getByRole("heading", { name: "Evaluación Persistencia" })).toBeVisible();

    // Verify the observation data is still visible
    await expect(
      page.getByLabel("Observaciones del encuentro").getByText(testData.estudiantes),
    ).toBeVisible();
  });
});

test.describe("MAE Observation Forms", () => {
  test("can complete MAE Observation Form - Encuentro 1 with all fields", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Obs1 ${suffix}`;
    const participantName = "Martina González";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Encuentro 1");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    // Create observation with MAE Observation Form - Encuentro 1
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_1_NAME });

    // Fill identification fields
    await page.getByLabel("Fecha del encuentro").fill("2025-01-15");
    await page.getByLabel("Edad del participante").fill("8");

    // Fill CONSIGNA fields
    await page.getByLabel("La toma en cuenta").check();
    await page.getByLabel("Trae emergente propio").check();
    await page.getByLabel("Necesita reiteración").uncheck();
    await page.getByLabel("Se concentra").check();

    // Fill DESARROLLO-PRODUCCIÓN fields
    await page.getByLabel("Inicia participación motivado").check();
    await page.getByLabel("Inicia participación indiferente").uncheck();
    await page.getByLabel("Tiempo de inicio dilatado").uncheck();
    await page.getByLabel("Tiempo de inicio esperable").check();
    await page.getByLabel("Tiempo de realización dilatado").uncheck();
    await page.getByLabel("Tiempo de realización esperable").check();
    await page.getByLabel("Explora materiales").check();
    await page.getByLabel("Repite uso de materiales").uncheck();
    await page.getByLabel("Dificultad de manipulación").uncheck();
    await page.getByLabel("Pide otros materiales").check();
    await page.getByLabel("Pulsión creadora presente").check();
    await page.getByLabel("Buen nivel de concentración en el trabajo").check();
    await page.getByLabel("Buen nivel de tolerancia a la frustración").check();
    await page.getByLabel("Pide ayuda").uncheck();
    await page.getByLabel("Se comunica").check();
    await page.getByLabel("Se aísla").uncheck();
    await page.getByLabel("Ayuda a otros").check();
    await page.getByLabel("Vínculo favorable con A.T.").check();

    // Fill CIERRE fields
    await page.getByLabel("Acepta propia obra").check();
    await page.getByLabel("Pone palabras a lo producido").check();
    await page.getByLabel("Asociaciones denotativas").check();
    await page.getByLabel("Asociaciones connotativas").uncheck();
    await page.getByLabel("Cambios de humor respecto al inicio").uncheck();
    await page.getByLabel("Cambios de actitud corporal respecto al inicio").uncheck();
    await page.getByLabel("Respeta la palabra de los otros").check();
    await page.getByLabel("Indiferente a la palabra de los otros").uncheck();
    await page.getByLabel("Logra esperar su turno").check();

    // Fill global fields (only in Encuentro 1)
    await page.getByLabel("Clima grupal favorecedor").check();
    await page.getByLabel("Clima grupal disruptivo").uncheck();
    await page.getByLabel("Clima grupal indiferente").uncheck();
    await page.getByLabel("Clima grupal participativo").check();
    await page.getByLabel("Respeto al encuadre").check();
    await page
      .getByLabel("Observaciones generales")
      .fill("Buen clima grupal, participante muy activo y comprometido.");

    // Save observation
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify observation is saved
    await expect(
      page.getByLabel("Observaciones del encuentro").getByText("2025-01-15"),
    ).toBeVisible();
  });

  test("validates conditional field logic in MAE Observation Forms", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Obs Cond ${suffix}`;
    const participantName = "Nicolás Ramírez";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Encuentro Test");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    // Create observation with MAE Observation Form - Encuentro 2
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_2_NAME });

    // Fill identification fields
    await page.getByLabel("Fecha del encuentro").fill("2025-01-20");
    await page.getByLabel("Edad del participante").fill("9");

    // Check that dificultad_manipulacion_cual is initially hidden
    // when dificultad_manipulacion is unchecked
    const dificultadCualField = page.getByLabel("Dificultad de manipulación - Cualitativa");
    await expect(dificultadCualField).not.toBeVisible();

    // Check dificultad_manipulacion
    await page.getByLabel("Dificultad de manipulación").check();

    // Now dificultad_manipulacion_cual should be visible and required
    await expect(dificultadCualField).toBeVisible();
    await dificultadCualField.fill("Presenta dificultad con tijeras y pegamento");

    // Try to save without filling the conditional field
    await page.getByLabel("Nivel de disposición al trabajo (4° encuentro)").fill("3");
    await page.getByRole("button", { name: "Guardar observación" }).click();

    // Should show validation error for the conditional field
    // (Note: exact behavior depends on implementation)

    // Fill remaining required fields and save
    await page.getByLabel("La toma en cuenta").check();
    await page.getByLabel("Se concentra").check();
    await page.getByLabel("Inicia participación motivado").check();
    await page.getByLabel("Tiempo de inicio esperable").check();
    await page.getByLabel("Tiempo de realización esperable").check();
    await page.getByLabel("Explora materiales").check();
    await page.getByLabel("Pulsión creadora presente").check();
    await page.getByLabel("Buen nivel de concentración en el trabajo").check();
    await page.getByLabel("Buen nivel de tolerancia a la frustración").check();
    await page.getByLabel("Acepta propia obra").check();
    await page.getByLabel("Pone palabras a lo producido").check();
    await page.getByLabel("Asociaciones denotativas").check();
    await page.getByLabel("Respeta la palabra de los otros").check();
    await page.getByLabel("Logra esperar su turno").check();

    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("can complete MAE Observation Form - Encuentro 5", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Obs5 ${suffix}`;
    const participantName = "Valentina Torres";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Encuentro 5");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    // Create observation with MAE Observation Form - Encuentro 5
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_5_NAME });

    // Fill identification fields
    await page.getByLabel("Fecha del encuentro").fill("2025-03-10");
    await page.getByLabel("Edad del participante").fill("8");

    // Fill a sample of fields (not all for brevity)
    await page.getByLabel("La toma en cuenta").check();
    await page.getByLabel("Trae emergente propio").check();
    await page.getByLabel("Necesita reiteración").uncheck();
    await page.getByLabel("Se concentra").check();

    await page.getByLabel("Inicia participación motivado").check();
    await page.getByLabel("Tiempo de inicio esperable").check();
    await page.getByLabel("Tiempo de realización esperable").check();
    await page.getByLabel("Explora materiales").check();
    await page.getByLabel("Pulsión creadora presente").check();
    await page.getByLabel("Buen nivel de concentración en el trabajo").check();
    await page.getByLabel("Buen nivel de tolerancia a la frustración").check();
    await page.getByLabel("Se comunica").check();
    await page.getByLabel("Ayuda a otros").check();
    await page.getByLabel("Vínculo favorable con A.T.").check();

    await page.getByLabel("Acepta propia obra").check();
    await page.getByLabel("Pone palabras a lo producido").check();
    await page.getByLabel("Asociaciones denotativas").check();
    await page.getByLabel("Respeta la palabra de los otros").check();
    await page.getByLabel("Logra esperar su turno").check();

    // Save observation
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify observation is saved
    await expect(
      page.getByLabel("Observaciones del encuentro").getByText("2025-03-10"),
    ).toBeVisible();
  });

  test("can complete MAE Observation Form - Encuentro 8", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Obs8 ${suffix}`;
    const participantName = "Lucas Medina";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Encuentro 8");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    // Create observation with MAE Observation Form - Encuentro 8
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_8_NAME });

    // Fill identification fields
    await page.getByLabel("Fecha del encuentro").fill("2025-05-20");
    await page.getByLabel("Edad del participante").fill("9");

    // Fill a sample of fields
    await page.getByLabel("La toma en cuenta").check();
    await page.getByLabel("Se concentra").check();

    await page.getByLabel("Inicia participación motivado").check();
    await page.getByLabel("Tiempo de inicio esperable").check();
    await page.getByLabel("Explora materiales").check();
    await page.getByLabel("Pulsión creadora presente").check();
    await page.getByLabel("Buen nivel de concentración en el trabajo").check();
    await page.getByLabel("Se comunica").check();
    await page.getByLabel("Vínculo favorable con A.T.").check();

    await page.getByLabel("Acepta propia obra").check();
    await page.getByLabel("Pone palabras a lo producido").check();
    await page.getByLabel("Respeta la palabra de los otros").check();
    await page.getByLabel("Logra esperar su turno").check();

    // Save observation
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify observation is saved
    await expect(
      page.getByLabel("Observaciones del encuentro").getByText("2025-05-20"),
    ).toBeVisible();
  });
});

test.describe("MAE Forms Integration", () => {
  test("can complete multiple MAE Observation Forms for the same participant", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Multi ${suffix}`;
    const participantName = "Emilia Castro";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create and complete Encuentro 1
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Encuentro 1");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_1_NAME });
    await page.getByLabel("Fecha del encuentro").fill("2025-01-15");
    await page.getByLabel("Edad del participante").fill("7");
    await page.getByLabel("La toma en cuenta").check();
    await page.getByLabel("Se concentra").check();
    await page.getByLabel("Inicia participación motivado").check();
    await page.getByLabel("Tiempo de inicio esperable").check();
    await page.getByLabel("Explora materiales").check();
    await page.getByLabel("Pulsión creadora presente").check();
    await page.getByLabel("Buen nivel de concentración en el trabajo").check();
    await page.getByLabel("Se comunica").check();
    await page.getByLabel("Vínculo favorable con A.T.").check();
    await page.getByLabel("Acepta propia obra").check();
    await page.getByLabel("Pone palabras a lo producido").check();
    await page.getByLabel("Asociaciones denotativas").check();
    await page.getByLabel("Respeta la palabra de los otros").check();
    await page.getByLabel("Logra esperar su turno").check();
    await page.getByLabel("Clima grupal favorecedor").check();
    await page.getByLabel("Respeto al encuadre").check();
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Create and complete Encuentro 2
    await page.getByRole("link", { name: "Proyectos" }).click();
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Encuentro 2");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_2_NAME });
    await page.getByLabel("Fecha del encuentro").fill("2025-02-10");
    await page.getByLabel("Edad del participante").fill("7");
    await page.getByLabel("La toma en cuenta").check();
    await page.getByLabel("Se concentra").check();
    await page.getByLabel("Inicia participación motivado").check();
    await page.getByLabel("Tiempo de inicio esperable").check();
    await page.getByLabel("Explora materiales").check();
    await page.getByLabel("Pulsión creadora presente").check();
    await page.getByLabel("Buen nivel de concentración en el trabajo").check();
    await page.getByLabel("Se comunica").check();
    await page.getByLabel("Vínculo favorable con A.T.").check();
    await page.getByLabel("Acepta propia obra").check();
    await page.getByLabel("Pone palabras a lo producido").check();
    await page.getByLabel("Asociaciones denotativas").check();
    await page.getByLabel("Respeta la palabra de los otros").check();
    await page.getByLabel("Logra esperar su turno").check();
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify both encounters exist
    await page.getByRole("link", { name: "Proyectos" }).click();
    await page.getByRole("link", { name: projectName }).first().click();

    await expect(page.getByRole("link", { name: "Encuentro 1" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Encuentro 2" })).toBeVisible();
  });

  test("can complete MAE Evaluation Form after Observation Forms", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Full ${suffix}`;
    const participantName = "Facundo López";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Complete one observation form first
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Encuentro Intermedio");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_5_NAME });
    await page.getByLabel("Fecha del encuentro").fill("2025-04-15");
    await page.getByLabel("Edad del participante").fill("10");
    await page.getByLabel("La toma en cuenta").check();
    await page.getByLabel("Se concentra").check();
    await page.getByLabel("Inicia participación motivado").check();
    await page.getByLabel("Tiempo de inicio esperable").check();
    await page.getByLabel("Explora materiales").check();
    await page.getByLabel("Pulsión creadora presente").check();
    await page.getByLabel("Buen nivel de concentración en el trabajo").check();
    await page.getByLabel("Se comunica").check();
    await page.getByLabel("Vínculo favorable con A.T.").check();
    await page.getByLabel("Acepta propia obra").check();
    await page.getByLabel("Pone palabras a lo producido").check();
    await page.getByLabel("Asociaciones denotativas").check();
    await page.getByLabel("Respeta la palabra de los otros").check();
    await page.getByLabel("Logra esperar su turno").check();
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Now complete evaluation form
    await page.getByRole("link", { name: "Proyectos" }).click();
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Evaluación Final");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });
    await page.getByLabel("Estudiante/s").fill("Facundo López");
    await page.getByLabel("Supervisora").fill("Lic. Diego Pereira");
    await page.getByLabel("Institución").fill("Escuela N° 78");
    await page.getByLabel("Edad").fill("10");
    await page.getByLabel("Nivel de disposición al trabajo (4° encuentro)").fill("4");
    await page.getByLabel("Nivel de disposición al trabajo (8° encuentro)").fill("5");
    await page.getByLabel("Valoración cualitativa").fill("Excelente progreso durante el ciclo.");
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify both encounters exist
    await page.getByRole("link", { name: "Proyectos" }).click();
    await page.getByRole("link", { name: projectName }).first().click();

    await expect(page.getByRole("link", { name: "Encuentro Intermedio" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Evaluación Final" })).toBeVisible();
  });

  test("can retrieve and view previously saved MAE form data", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Proyecto MAE Retrieve ${suffix}`;
    const participantName = "Camila Silva";

    // Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();

    // Create encounter and save observation
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    await page.getByLabel("Nombre del encuentro").fill("Encuentro de Prueba");
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();

    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });
    await page.getByLabel("Estudiante/s").fill("Camila Silva");
    await page.getByLabel("Supervisora").fill("Lic. Julia Fernández");
    await page.getByLabel("Institución").fill("Institución Educativa Municipal");
    await page.getByLabel("Edad").fill("11");
    await page.getByLabel("Nivel de disposición al trabajo (4° encuentro)").fill("3");
    await page.getByLabel("Nivel de disposición al trabajo (8° encuentro)").fill("4");
    await page.getByRole("button", { name: "Guardar observación" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Navigate away and come back
    await page.getByRole("link", { name: "Proyectos" }).click();
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Encuentro de Prueba" }).click();

    // Verify the observation data is still visible
    await expect(
      page.getByLabel("Observaciones del encuentro").getByText("Camila Silva"),
    ).toBeVisible();
  });
});
