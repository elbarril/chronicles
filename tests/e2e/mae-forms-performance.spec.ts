import { expect, test } from "@playwright/test";

/**
 * Performance tests for MAE (Modelo de Acompañamiento Educativo) Forms
 *
 * These tests measure:
 * - Form rendering performance (time to render forms with ~33-40 fields)
 * - UI responsiveness during interaction
 * - Load handling (multiple forms loaded simultaneously)
 * - Observation creation performance with MAE forms
 *
 * Performance criteria:
 * - Form rendering < 2s
 * - No significant degradation under load
 * - UI responds fluidly (< 100ms for field interactions)
 */

const MAE_EVAL_FORM_NAME = "MAE - Ficha de Evaluación";
const MAE_OBS_FORM_ENC_1_NAME = "MAE - Ficha de Observación - Encuentro 1";
const MAE_OBS_FORM_ENC_5_NAME = "MAE - Ficha de Observación - Encuentro 5";
const MAE_OBS_FORM_ENC_8_NAME = "MAE - Ficha de Observación - Encuentro 8";

test.describe("MAE Forms - Rendering Performance", () => {
  test("MAE Evaluation Form renders in acceptable time", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Perf Test Eval ${suffix}`;
    const participantName = "Juan Pérez";

    // Setup: Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    // Setup: Create encounter
    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    const encounterName = `Encuentro Perf ${suffix}`;
    await page.getByLabel("Nombre del encuentro").fill(encounterName);
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();
    await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

    // Measure form rendering time
    await page.getByRole("button", { name: "Nueva observación" }).click();

    const renderStartTime = await page.evaluate(() => performance.now());
    await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });

    // Wait for form to be visible
    await expect(page.getByLabel("Estudiante/s")).toBeVisible();

    const renderEndTime = await page.evaluate(() => performance.now());
    const renderTime = renderEndTime - renderStartTime;

    console.log(`MAE Evaluation Form render time: ${renderTime.toFixed(2)}ms`);

    // Performance criteria: < 2s (2000ms)
    expect(renderTime).toBeLessThan(2000);

    // Additional check: Form has all 29 fields rendered
    const fieldCount = await page.evaluate(() => {
      const inputs = document.querySelectorAll("input, textarea, select");
      return inputs.length;
    });
    console.log(`MAE Evaluation Form field count: ${fieldCount}`);
    expect(fieldCount).toBeGreaterThanOrEqual(29);
  });

  test("MAE Observation Form - Encuentro 1 renders in acceptable time", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Perf Test Obs1 ${suffix}`;
    const participantName = "María García";

    // Setup
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    const encounterName = `Encuentro Perf ${suffix}`;
    await page.getByLabel("Nombre del encuentro").fill(encounterName);
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();
    await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

    // Measure form rendering time (largest form with 40 fields including globals)
    await page.getByRole("button", { name: "Nueva observación" }).click();

    const renderStartTime = await page.evaluate(() => performance.now());
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_1_NAME });

    // Wait for form to be visible
    await expect(page.getByLabel("Fecha del encuentro")).toBeVisible();

    const renderEndTime = await page.evaluate(() => performance.now());
    const renderTime = renderEndTime - renderStartTime;

    console.log(`MAE Observation Form - Encuentro 1 render time: ${renderTime.toFixed(2)}ms`);

    // Performance criteria: < 2s (2000ms)
    expect(renderTime).toBeLessThan(2000);

    // Additional check: Form has all 40 fields rendered
    const fieldCount = await page.evaluate(() => {
      const inputs = document.querySelectorAll("input, textarea, select");
      return inputs.length;
    });
    console.log(`MAE Observation Form - Encuentro 1 field count: ${fieldCount}`);
    expect(fieldCount).toBeGreaterThanOrEqual(40);
  });

  test("MAE Observation Form - Encuentro 5 renders in acceptable time", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Perf Test Obs5 ${suffix}`;
    const participantName = "Carlos López";

    // Setup
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    const encounterName = `Encuentro Perf ${suffix}`;
    await page.getByLabel("Nombre del encuentro").fill(encounterName);
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();
    await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

    // Measure form rendering time (34 fields, no globals)
    await page.getByRole("button", { name: "Nueva observación" }).click();

    const renderStartTime = await page.evaluate(() => performance.now());
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_5_NAME });

    // Wait for form to be visible
    await expect(page.getByLabel("Fecha del encuentro")).toBeVisible();

    const renderEndTime = await page.evaluate(() => performance.now());
    const renderTime = renderEndTime - renderStartTime;

    console.log(`MAE Observation Form - Encuentro 5 render time: ${renderTime.toFixed(2)}ms`);

    // Performance criteria: < 2s (2000ms)
    expect(renderTime).toBeLessThan(2000);

    // Additional check: Form has all 34 fields rendered
    const fieldCount = await page.evaluate(() => {
      const inputs = document.querySelectorAll("input, textarea, select");
      return inputs.length;
    });
    console.log(`MAE Observation Form - Encuentro 5 field count: ${fieldCount}`);
    expect(fieldCount).toBeGreaterThanOrEqual(34);
  });
});

test.describe("MAE Forms - UI Responsiveness", () => {
  test("field interactions respond fluidly in MAE Evaluation Form", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Perf Test UI Eval ${suffix}`;
    const participantName = "Ana Martínez";

    // Setup
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    const encounterName = `Encuentro Perf ${suffix}`;
    await page.getByLabel("Nombre del encuentro").fill(encounterName);
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();
    await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

    // Open form
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });
    await expect(page.getByLabel("Estudiante/s")).toBeVisible();

    // Measure field interaction response time
    const interactionTimes: number[] = [];

    // Test text input
    const start1 = await page.evaluate(() => performance.now());
    await page.getByLabel("Estudiante/s").fill("Juan Pérez");
    const end1 = await page.evaluate(() => performance.now());
    interactionTimes.push(end1 - start1);

    // Test number input
    const start2 = await page.evaluate(() => performance.now());
    await page.getByLabel("Edad").fill("10");
    const end2 = await page.evaluate(() => performance.now());
    interactionTimes.push(end2 - start2);

    // Test rating interaction (use specific encounter to avoid selector ambiguity)
    const start3 = await page.evaluate(() => performance.now());
    await page.getByLabel("Nivel de disposición al trabajo (4° encuentro)").click();
    const end3 = await page.evaluate(() => performance.now());
    interactionTimes.push(end3 - start3);

    const avgInteractionTime =
      interactionTimes.reduce((a, b) => a + b, 0) / interactionTimes.length;
    console.log(`Average field interaction time: ${avgInteractionTime.toFixed(2)}ms`);
    console.log(
      `Individual interaction times: ${interactionTimes.map((t) => t.toFixed(2)).join("ms, ")}ms`,
    );

    // Performance criteria: UI should respond fluidly (< 100ms for interactions)
    interactionTimes.forEach((time) => {
      expect(time).toBeLessThan(100);
    });
  });

  test("conditional field logic responds fluidly in MAE Observation Form", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Perf Test Cond ${suffix}`;
    const participantName = "Pedro Sánchez";

    // Setup
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    const encounterName = `Encuentro Perf ${suffix}`;
    await page.getByLabel("Nombre del encuentro").fill(encounterName);
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();
    await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

    // Open form
    await page.getByRole("button", { name: "Nueva observación" }).click();
    await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_1_NAME });
    await expect(page.getByLabel("Fecha del encuentro")).toBeVisible();

    // Scroll to conditional field section
    await page.getByLabel("Dificultad en la manipulación de materiales").scrollIntoViewIfNeeded();

    // Measure conditional field show/hide response time
    const showStartTime = await page.evaluate(() => performance.now());
    await page.getByLabel("Dificultad en la manipulación de materiales").check();
    await expect(page.getByLabel("¿Cuál dificultad?")).toBeVisible();
    const showEndTime = await page.evaluate(() => performance.now());
    const showTime = showEndTime - showStartTime;

    console.log(`Conditional field show time: ${showTime.toFixed(2)}ms`);

    // Performance criteria: conditional logic should respond quickly (< 200ms)
    expect(showTime).toBeLessThan(200);

    // Measure hide time
    const hideStartTime = await page.evaluate(() => performance.now());
    await page.getByLabel("Dificultad en la manipulación de materiales").uncheck();
    await expect(page.getByLabel("¿Cuál dificultad?")).not.toBeVisible();
    const hideEndTime = await page.evaluate(() => performance.now());
    const hideTime = hideEndTime - hideStartTime;

    console.log(`Conditional field hide time: ${hideTime.toFixed(2)}ms`);

    // Performance criteria: conditional logic should respond quickly (< 200ms)
    expect(hideTime).toBeLessThan(200);
  });
});

test.describe("MAE Forms - Load Handling", () => {
  test("multiple MAE forms can be loaded without significant degradation", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Perf Test Multi ${suffix}`;
    const participantName = "Laura Rodríguez";

    // Setup: Create project with participant
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    // Create multiple encounters with observations
    const formRenderTimes: number[] = [];

    for (let i = 1; i <= 4; i++) {
      // Create encounter
      await page.goto("/projects");
      await page.getByRole("link", { name: projectName }).first().click();
      await page.getByRole("link", { name: "Crear encuentro" }).click();
      const encounterName = `Encuentro Multi ${i}-${suffix}`;
      await page.getByLabel("Nombre del encuentro").fill(encounterName);
      await page.getByLabel(participantName).check();
      await page.getByRole("button", { name: "Crear encuentro" }).click();
      await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

      // Create observation with different form
      await page.getByRole("button", { name: "Nueva observación" }).click();

      const renderStartTime = await page.evaluate(() => performance.now());

      // Alternate between different forms
      if (i === 1) {
        await page.getByLabel("Formulario").selectOption({ label: MAE_EVAL_FORM_NAME });
        await expect(page.getByLabel("Estudiante/s")).toBeVisible();
      } else if (i === 2) {
        await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_1_NAME });
        await expect(page.getByLabel("Fecha del encuentro")).toBeVisible();
      } else if (i === 3) {
        await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_5_NAME });
        await expect(page.getByLabel("Fecha del encuentro")).toBeVisible();
      } else {
        await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_8_NAME });
        await expect(page.getByLabel("Fecha del encuentro")).toBeVisible();
      }

      const renderEndTime = await page.evaluate(() => performance.now());
      const renderTime = renderEndTime - renderStartTime;
      formRenderTimes.push(renderTime);

      console.log(`Form ${i} render time: ${renderTime.toFixed(2)}ms`);

      // Save observation
      await page.getByRole("button", { name: "Guardar observación" }).click();
      await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();
    }

    const avgRenderTime = formRenderTimes.reduce((a, b) => a + b, 0) / formRenderTimes.length;
    const maxRenderTime = Math.max(...formRenderTimes);

    console.log(`Average render time across 4 forms: ${avgRenderTime.toFixed(2)}ms`);
    console.log(`Max render time across 4 forms: ${maxRenderTime.toFixed(2)}ms`);

    // Performance criteria: No significant degradation
    // Each form should still render < 2s even after loading multiple forms
    formRenderTimes.forEach((time) => {
      expect(time).toBeLessThan(2000);
    });

    // Check that the last form doesn't take significantly longer than the first
    // (allow up to 50% degradation as acceptable)
    const firstRenderTime = formRenderTimes[0];
    const lastRenderTime = formRenderTimes[3];
    if (!firstRenderTime || !lastRenderTime) {
      throw new Error("Missing render time data");
    }
    const degradationRatio = lastRenderTime / firstRenderTime;
    console.log(`Degradation ratio (last/first): ${degradationRatio.toFixed(2)}`);
    expect(degradationRatio).toBeLessThan(1.5);
  });

  test("creating observations with MAE forms does not degrade performance", async ({ page }) => {
    const suffix = Date.now().toString();
    const projectName = `Perf Test ObsCreate ${suffix}`;
    const participantName = "Roberto Fernández";

    // Setup
    await page.goto("/projects/new");
    await page.getByLabel("Nombre del proyecto").fill(projectName);
    await page.getByPlaceholder("Participante 1").fill(participantName);
    await page.getByRole("button", { name: "Guardar proyecto" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    await page.goto("/projects");
    await page.getByRole("link", { name: projectName }).first().click();
    await page.getByRole("link", { name: "Crear encuentro" }).click();
    const encounterName = `Encuentro Perf ${suffix}`;
    await page.getByLabel("Nombre del encuentro").fill(encounterName);
    await page.getByLabel(participantName).check();
    await page.getByRole("button", { name: "Crear encuentro" }).click();
    await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();

    // Create multiple observations with the same form
    const observationCreateTimes: number[] = [];

    for (let i = 1; i <= 3; i++) {
      await page.getByRole("button", { name: "Nueva observación" }).click();

      const createStartTime = await page.evaluate(() => performance.now());

      await page.getByLabel("Formulario").selectOption({ label: MAE_OBS_FORM_ENC_5_NAME });
      await expect(page.getByLabel("Fecha del encuentro")).toBeVisible();

      // Fill minimal required fields
      await page.getByLabel("Fecha del encuentro").fill("2025-01-15");
      await page.getByLabel("Edad del participante").fill("8");

      // Save
      await page.getByRole("button", { name: "Guardar observación" }).click();

      const createEndTime = await page.evaluate(() => performance.now());
      const createTime = createEndTime - createStartTime;
      observationCreateTimes.push(createTime);

      console.log(`Observation ${i} creation time: ${createTime.toFixed(2)}ms`);

      await expect(page.getByRole("heading", { name: encounterName })).toBeVisible();
    }

    const avgCreateTime =
      observationCreateTimes.reduce((a, b) => a + b, 0) / observationCreateTimes.length;

    console.log(`Average observation creation time: ${avgCreateTime.toFixed(2)}ms`);

    // Performance criteria: Observation creation should remain fast
    // Total time (form load + fill + save) should be < 5s per observation
    observationCreateTimes.forEach((time) => {
      expect(time).toBeLessThan(5000);
    });

    // Check for degradation
    const firstCreateTime = observationCreateTimes[0];
    const lastCreateTime = observationCreateTimes[2];
    if (!firstCreateTime || !lastCreateTime) {
      throw new Error("Missing observation creation time data");
    }
    const degradationRatio = lastCreateTime / firstCreateTime;
    console.log(`Degradation ratio (last/first): ${degradationRatio.toFixed(2)}`);
    expect(degradationRatio).toBeLessThan(1.5);
  });
});
