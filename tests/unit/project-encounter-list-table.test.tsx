import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { type Encounter } from "@/domain/encounter";
import { ProjectEncounterListTable } from "@/features/projects/components/ProjectEncounterListTable";

const isoDate = "2026-04-30T12:00:00.000Z";

function buildEncounter(overrides: Partial<Encounter> = {}): Encounter {
  return {
    id: "00000000-0000-4000-8000-0000000000e1",
    projectId: "00000000-0000-4000-8000-0000000000a1",
    name: "Sesión de prueba",
    startsAt: isoDate,
    endsAt: isoDate,
    participantIds: [],
    archivedAt: "",
    createdAt: isoDate,
    updatedAt: isoDate,
    ...overrides,
  };
}

function renderTable({
  encounter,
  validParticipantIds,
}: {
  encounter: Encounter;
  validParticipantIds: string[];
}): void {
  render(
    <MemoryRouter>
      <ProjectEncounterListTable
        encounters={[encounter]}
        status="active"
        projectId={encounter.projectId}
        validParticipantIds={validParticipantIds}
        onArchive={vi.fn().mockResolvedValue(undefined)}
        onRestore={vi.fn().mockResolvedValue(undefined)}
        onDelete={vi.fn().mockResolvedValue(undefined)}
      />
    </MemoryRouter>,
  );
}

describe("<ProjectEncounterListTable />", () => {
  it("counts only participants that still belong to the project (mobile card)", () => {
    const stillThere = "00000000-0000-4000-8000-0000000000b1";
    const alsoThere = "00000000-0000-4000-8000-0000000000b2";
    const removed = "00000000-0000-4000-8000-0000000000b3";

    renderTable({
      encounter: buildEncounter({
        participantIds: [stillThere, alsoThere, removed],
      }),
      validParticipantIds: [stillThere, alsoThere],
    });

    const list = screen.getByLabelText("Listado de encuentros del proyecto");
    expect(within(list).getByText("Participantes:")).toBeInTheDocument();
    expect(within(list).getByText("2")).toBeInTheDocument();
    expect(within(list).queryByText("3")).not.toBeInTheDocument();
  });

  it("counts only participants that still belong to the project (desktop table)", () => {
    const stillThere = "00000000-0000-4000-8000-0000000000c1";
    const removed1 = "00000000-0000-4000-8000-0000000000c2";
    const removed2 = "00000000-0000-4000-8000-0000000000c3";

    renderTable({
      encounter: buildEncounter({
        participantIds: [stillThere, removed1, removed2],
      }),
      validParticipantIds: [stillThere],
    });

    const table = screen.getByRole("table");
    const cells = within(table).getAllByRole("cell");
    // The 4th cell is the participants column (Nombre, Inicio, Cierre, Participantes, Acciones).
    expect(cells[3]).toHaveTextContent(/^1$/);
  });

  it("matches the raw count when every encounter participant is still valid", () => {
    const a = "00000000-0000-4000-8000-0000000000d1";
    const b = "00000000-0000-4000-8000-0000000000d2";

    renderTable({
      encounter: buildEncounter({ participantIds: [a, b] }),
      validParticipantIds: [a, b, "00000000-0000-4000-8000-0000000000d3"],
    });

    const list = screen.getByLabelText("Listado de encuentros del proyecto");
    expect(within(list).getByText("2")).toBeInTheDocument();
  });
});
