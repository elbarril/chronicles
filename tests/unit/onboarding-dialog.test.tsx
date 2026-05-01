import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RootLayout } from "@/app/layout";
import { ThemeProvider } from "@/app/theme";
import { onboardingMessages } from "@/features/onboarding/messages";
import { onboardingStorageKey } from "@/features/onboarding/services/onboarding-service";

const INTRO_STEPS = onboardingMessages.introSteps.length;
const DEMO_ENCOUNTER_ID = "00000000-0000-4000-8000-00000000d411";
const DEMO_CHRONICLE_ID = "00000000-0000-4000-8000-00000000c111";

const seedDemoEncounterMock = vi.fn();
const removeDemoEncounterMock = vi.fn();
const getChronicleForEncounterMock = vi.fn();

// Stub the database-touching services so the tutorial seed/cleanup runs
// in tests without touching IndexedDB.
vi.mock("@/features/defaults/services/defaults-service", () => ({
  seedDemoEncounter: (...args: unknown[]) => seedDemoEncounterMock(...args),
  removeDemoEncounter: (...args: unknown[]) => removeDemoEncounterMock(...args),
}));

vi.mock("@/features/chronicles/services/chronicle-service", async () => {
  const actual = await vi.importActual<
    typeof import("@/features/chronicles/services/chronicle-service")
  >("@/features/chronicles/services/chronicle-service");
  return {
    ...actual,
    getChronicleForEncounter: (...args: unknown[]) => getChronicleForEncounterMock(...args),
  };
});

function LocationProbe(): JSX.Element {
  const location = useLocation();
  return <div data-testid="location-pathname">{location.pathname}</div>;
}

function HomeStub(): JSX.Element {
  return (
    <div>
      <p>Home</p>
      <a href="/fields" data-tour="hub.fields">
        Campos
      </a>
      <a href="/forms" data-tour="hub.forms">
        Formularios
      </a>
      <a href="/groups" data-tour="hub.groups">
        Grupos
      </a>
      <a href="/encounters" data-tour="hub.encounters">
        Encuentros
      </a>
      <a href="/chronicles" data-tour="hub.chronicles">
        Crónicas
      </a>
      <a href="/settings" data-tour="hub.settings">
        Configuración
      </a>
    </div>
  );
}

function renderApp() {
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={["/"]}>
        <LocationProbe />
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomeStub />} />
            <Route
              path="fields"
              element={
                <div>
                  <p>Fields</p>
                  <a href="/fields/new" data-tour="fields.new-button">
                    Nuevo campo
                  </a>
                  <div data-tour="fields.list-region">List</div>
                </div>
              }
            />
            <Route
              path="fields/new"
              element={
                <div>
                  <p>New field</p>
                  <div data-tour="fields.type-selector">Type</div>
                  <div data-tour="fields.new.name-input">Name</div>
                  <button data-tour="fields.save-button">Guardar campo</button>
                </div>
              }
            />
            <Route
              path="forms"
              element={
                <div>
                  <p>Forms</p>
                  <a href="/forms/new" data-tour="forms.new-button">
                    Nuevo formulario
                  </a>
                  <div data-tour="forms.list-region">List</div>
                </div>
              }
            />
            <Route
              path="forms/new"
              element={
                <div>
                  <p>New form</p>
                  <div data-tour="forms.new.name-input">Name</div>
                  <div data-tour="forms.new.field-picker">Picker</div>
                  <button data-tour="forms.new.save-button">Guardar formulario</button>
                </div>
              }
            />
            <Route
              path="groups"
              element={
                <div>
                  <p>Groups</p>
                  <a href="/groups/new" data-tour="groups.new-button">
                    Nuevo grupo
                  </a>
                  <div data-tour="groups.list-region">List</div>
                </div>
              }
            />
            <Route
              path="groups/new"
              element={
                <div>
                  <p>New group</p>
                  <div data-tour="groups.new.name-input">Name</div>
                  <div data-tour="groups.new.participants">Participants</div>
                  <button data-tour="groups.new.save-button">Guardar grupo</button>
                </div>
              }
            />
            <Route
              path="encounters"
              element={
                <div>
                  <p>Encounters</p>
                  <a href="/encounters/new" data-tour="encounters.new-button">
                    Nuevo encuentro
                  </a>
                  <div data-tour="encounters.filter-bar">Filters</div>
                </div>
              }
            />
            <Route
              path="encounters/new"
              element={
                <div>
                  <p>New encounter</p>
                  <div data-tour="encounters.new.group-selector">Group</div>
                  <div data-tour="encounters.new.form-selector">Form</div>
                  <button data-tour="encounters.new.start-button">Crear encuentro</button>
                </div>
              }
            />
            <Route
              path="encounters/:id"
              element={
                <div>
                  <p>Encounter detail</p>
                  <header data-tour="encounter.detail.header">Header</header>
                  <div data-tour="encounter.detail.observations-list">Timeline</div>
                  <button data-tour="encounter.detail.new-observation">Nueva observación</button>
                  <button data-tour="encounter.detail.generate-chronicle">Generar crónica</button>
                  <button data-tour="encounter.detail.finalize">Finalizar</button>
                </div>
              }
            />
            <Route
              path="encounters/:id/observations/new"
              element={
                <div>
                  <p>Encounter observation new</p>
                  <div data-tour="encounter.detail.observation-form">Form</div>
                </div>
              }
            />
            <Route
              path="settings"
              element={
                <div>
                  <p>Settings</p>
                  <button data-tour="settings.export">Exportar todo</button>
                  <div data-tour="import.dropzone">Dropzone</div>
                </div>
              }
            />
            <Route
              path="chronicles"
              element={
                <div>
                  <p>Chronicles</p>
                  <div data-tour="chronicles.list-region">List</div>
                </div>
              }
            />
            <Route
              path="chronicles/:id"
              element={
                <div>
                  <p>Chronicle detail</p>
                  <div data-tour="chronicle.detail.content">Content</div>
                  <button data-tour="chronicle.detail.regenerate">Regenerar</button>
                  <button data-tour="chronicle.detail.share">Compartir</button>
                  <div data-tour="chronicle.detail.media">Media</div>
                </div>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

function getPathname(): string {
  return screen.getByTestId("location-pathname").textContent ?? "";
}

function getIntroDialog(): HTMLElement {
  return screen.getByRole("dialog", { name: /cómo funciona chronicle/i });
}

async function clickNext(dialog: HTMLElement, user: ReturnType<typeof userEvent.setup>) {
  const next = within(dialog).getByRole("button", { name: /siguiente/i });
  await user.click(next);
}

async function advanceThroughIntro(user: ReturnType<typeof userEvent.setup>) {
  await clickNext(getIntroDialog(), user);
  await clickNext(screen.getByRole("dialog", { name: /cómo se guardan tus datos/i }), user);
  await clickNext(screen.getByRole("dialog", { name: /generación de crónicas con ia/i }), user);
}

async function advanceTo(user: ReturnType<typeof userEvent.setup>, finalDialogTitle: RegExp) {
  // Helper that keeps clicking Siguiente on the currently-visible
  // tutorial dialog until a dialog matching the given title appears.
  const seenTitles = new Set<string>();
  for (let i = 0; i < 60; i += 1) {
    const dialogs = screen.queryAllByRole("dialog");
    const current = dialogs[dialogs.length - 1];
    if (!current) {
      throw new Error("No tutorial dialog visible");
    }
    const title = current.querySelector("h2,[role=heading]")?.textContent ?? "";
    if (finalDialogTitle.test(title)) {
      return current;
    }
    seenTitles.add(title);
    await clickNext(current, user);
  }
  throw new Error(
    `Did not reach dialog matching ${finalDialogTitle}. Seen titles: ${[...seenTitles].join(", ")}`,
  );
}

describe("OnboardingDialog", () => {
  beforeEach(() => {
    window.localStorage.removeItem(onboardingStorageKey);
    seedDemoEncounterMock.mockReset().mockResolvedValue({
      encounterId: DEMO_ENCOUNTER_ID,
      created: true,
    });
    removeDemoEncounterMock.mockReset().mockResolvedValue({ removed: true });
    getChronicleForEncounterMock.mockReset().mockResolvedValue({ id: DEMO_CHRONICLE_ID });
  });

  it("opens automatically on first visit and shows the first intro step with 'Paso 1 de 3'", () => {
    renderApp();

    const dialog = getIntroDialog();
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(new RegExp(`paso 1 de ${INTRO_STEPS}`, "i")),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/para qué sirve chronicle/i)).toBeInTheDocument();
  });

  it("walks through the three intro steps using the 'Paso n de 3' counter", async () => {
    const user = userEvent.setup();
    renderApp();

    const dialog = getIntroDialog();
    expect(within(dialog).getByRole("button", { name: /anterior/i })).toBeDisabled();

    await clickNext(dialog, user);
    const dialogStep2 = screen.getByRole("dialog", { name: /cómo se guardan tus datos/i });
    expect(
      within(dialogStep2).getByText(new RegExp(`paso 2 de ${INTRO_STEPS}`, "i")),
    ).toBeInTheDocument();
    expect(within(dialogStep2).getByRole("button", { name: /anterior/i })).toBeEnabled();

    await clickNext(dialogStep2, user);
    const dialogStep3 = screen.getByRole("dialog", {
      name: /generación de crónicas con ia/i,
    });
    expect(
      within(dialogStep3).getByText(new RegExp(`paso 3 de ${INTRO_STEPS}`, "i")),
    ).toBeInTheDocument();
  });

  it("seeds the demo data when the tour starts and starts on the Campos hub-stop", async () => {
    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    // Demo seeding fires when the tour begins.
    await waitFor(() => {
      expect(seedDemoEncounterMock).toHaveBeenCalled();
    });

    // First tour step is a hub-stop, so we should still be at "/"
    expect(getPathname()).toBe("/");
    const hubStop = await screen.findByRole("dialog", { name: /vamos a campos/i });
    expect(hubStop).toBeInTheDocument();
    expect(hubStop.getAttribute("aria-modal")).toBe("false");
    expect(within(hubStop).queryByText(/paso \d+ de \d+/i)).toBeNull();
  });

  it("returns from the first tour step back to the last intro step", async () => {
    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    const hubStop = await screen.findByRole("dialog", { name: /vamos a campos/i });
    const previous = within(hubStop).getByRole("button", { name: /anterior/i });
    expect(previous).toBeEnabled();
    await user.click(previous);

    expect(
      screen.getByRole("dialog", { name: /generación de crónicas con ia/i }),
    ).toBeInTheDocument();
  });

  it("walks through the Campos creation flow including the name input step", async () => {
    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    // hub-stop → list → new button → /fields/new (tipo) → nombre → guardar
    await advanceTo(user, /vamos a campos/i);
    await advanceTo(user, /campos: la lista/i);
    await advanceTo(user, /crear un campo/i);
    await advanceTo(user, /tipo del campo/i);
    await waitFor(() => expect(getPathname()).toBe("/fields/new"));

    await advanceTo(user, /nombre del campo/i);
    await advanceTo(user, /guardar el campo/i);

    // Spotlight on the save button after walking through type and name.
    await waitFor(() => {
      expect(
        document
          .querySelector('[data-tour="fields.save-button"]')
          ?.getAttribute("data-tour-spotlight"),
      ).toBe("active");
    });
  });

  it("after the Campos flow lands back on the hub for Formularios", async () => {
    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    await advanceTo(user, /ahora vamos a formularios/i);
    expect(getPathname()).toBe("/");
    await waitFor(() => {
      expect(
        document.querySelector('[data-tour="hub.forms"]')?.getAttribute("data-tour-spotlight"),
      ).toBe("active");
    });
  });

  it("walks through the encounter detail flow using the seeded demo encounter id", async () => {
    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    // Wait for the seed to populate the tutorial context with the demo
    // encounter id, then walk to the encounter detail step.
    await waitFor(() => {
      expect(seedDemoEncounterMock).toHaveBeenCalled();
    });

    await advanceTo(user, /timeline del encuentro/i);
    await waitFor(
      () => {
        expect(getPathname()).toBe(`/encounters/${DEMO_ENCOUNTER_ID}`);
      },
      { timeout: 3000 },
    );
  });

  it("walks through to the chronicle detail page using the seeded chronicle id", async () => {
    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    await waitFor(() => {
      expect(getChronicleForEncounterMock).toHaveBeenCalledWith(DEMO_ENCOUNTER_ID);
    });

    await advanceTo(user, /el cuerpo de la crónica/i);
    await waitFor(
      () => {
        expect(getPathname()).toBe(`/chronicles/${DEMO_CHRONICLE_ID}`);
      },
      { timeout: 3000 },
    );
  });

  it("removes the demo data on dismiss when the tutorial owns it", async () => {
    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    await waitFor(() => expect(seedDemoEncounterMock).toHaveBeenCalled());

    // Skip the tutorial — cleanup should run.
    const tourCard = await screen.findByRole("dialog", { name: /vamos a campos/i });
    await user.click(within(tourCard).getByRole("button", { name: /saltar tutorial/i }));

    await waitFor(() => {
      expect(removeDemoEncounterMock).toHaveBeenCalled();
    });
  });

  it("does not remove demo data on dismiss when the tutorial did NOT create it", async () => {
    seedDemoEncounterMock.mockResolvedValue({ encounterId: DEMO_ENCOUNTER_ID, created: false });

    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    await waitFor(() => expect(seedDemoEncounterMock).toHaveBeenCalled());

    const tourCard = await screen.findByRole("dialog", { name: /vamos a campos/i });
    await user.click(within(tourCard).getByRole("button", { name: /saltar tutorial/i }));

    // Give a beat for any async cleanup to (not) happen.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(removeDemoEncounterMock).not.toHaveBeenCalled();
  });

  it("can step backwards through the tour all the way to the intro modals", async () => {
    const user = userEvent.setup();
    renderApp();
    await advanceThroughIntro(user);

    // Move forward into the second hub-stop (Formularios).
    const formsHubStop = await advanceTo(user, /ahora vamos a formularios/i);

    // Walk backwards using Anterior until we land back on the AI intro.
    let current = formsHubStop;
    for (let i = 0; i < 30; i += 1) {
      const previousButton = within(current).queryByRole("button", { name: /anterior/i });
      if (!previousButton || (previousButton as HTMLButtonElement).disabled) break;
      await user.click(previousButton);
      const dialogs = screen.queryAllByRole("dialog");
      current = dialogs[dialogs.length - 1] ?? current;
      const title = current.querySelector("h2,[role=heading]")?.textContent ?? "";
      if (/generación de crónicas con ia/i.test(title)) break;
    }

    expect(
      screen.getByRole("dialog", { name: /generación de crónicas con ia/i }),
    ).toBeInTheDocument();
  });

  it("can skip the tutorial and persists the completion flag", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(within(getIntroDialog()).getByRole("button", { name: /saltar tutorial/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.localStorage.getItem(onboardingStorageKey)).toBe("true");
  });

  it("does not open if onboarding was already completed", () => {
    window.localStorage.setItem(onboardingStorageKey, "true");

    renderApp();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
