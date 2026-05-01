import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEMO_ENCOUNTER_ID,
  DEMO_FIELD_IDS,
  DEMO_FORM_ID,
  DEMO_GROUP_ID,
  DEMO_PARTICIPANT_ONE_ID,
  DEMO_PARTICIPANT_TWO_ID,
} from "@/features/defaults/lib/seed-data";
import { removeDemoEncounter } from "@/features/defaults/services/defaults-service";

const {
  observationsWhereMock,
  observationsBulkDeleteMock,
  chroniclesWhereMock,
  chroniclesBulkDeleteMock,
  encountersGetMock,
  encountersDeleteMock,
  participantsBulkDeleteMock,
  groupsDeleteMock,
  formsDeleteMock,
  fieldsBulkDeleteMock,
  mediaBulkDeleteMock,
} = vi.hoisted(() => ({
  observationsWhereMock: vi.fn(),
  observationsBulkDeleteMock: vi.fn(),
  chroniclesWhereMock: vi.fn(),
  chroniclesBulkDeleteMock: vi.fn(),
  encountersGetMock: vi.fn(),
  encountersDeleteMock: vi.fn(),
  participantsBulkDeleteMock: vi.fn(),
  groupsDeleteMock: vi.fn(),
  formsDeleteMock: vi.fn(),
  fieldsBulkDeleteMock: vi.fn(),
  mediaBulkDeleteMock: vi.fn(),
}));

vi.mock("@/infra/db/client", () => {
  type TransactionFn = () => Promise<unknown>;

  const where = (mock: ReturnType<typeof vi.fn>) => (column: string) => ({
    equals: (value: string) => ({
      toArray: () => mock(column, value),
    }),
  });

  return {
    db: {
      transaction: (_mode: string, ..._args: unknown[]) => {
        const fn = _args[_args.length - 1] as TransactionFn;
        return fn();
      },
      observations: {
        where: where(observationsWhereMock),
        bulkDelete: observationsBulkDeleteMock,
      },
      chronicles: {
        where: where(chroniclesWhereMock),
        bulkDelete: chroniclesBulkDeleteMock,
      },
      encounters: {
        get: encountersGetMock,
        delete: encountersDeleteMock,
      },
      participants: {
        bulkDelete: participantsBulkDeleteMock,
      },
      groups: {
        delete: groupsDeleteMock,
      },
      forms: {
        delete: formsDeleteMock,
      },
      fields: {
        bulkDelete: fieldsBulkDeleteMock,
      },
      media: {
        bulkDelete: mediaBulkDeleteMock,
      },
    },
  };
});

describe("removeDemoEncounter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("wipes the entire demo scenario including media blobs from observations", async () => {
    encountersGetMock.mockResolvedValueOnce({ id: DEMO_ENCOUNTER_ID });
    observationsWhereMock.mockResolvedValueOnce([
      {
        id: "obs-1",
        encounterId: DEMO_ENCOUNTER_ID,
        values: {
          fAudio: { mediaId: "media-audio" },
          fImages: { mediaIds: ["media-img-1", "media-img-2"] },
          fText: "Algo",
        },
        createdAt: "2026-04-30T18:00:00.000Z",
      },
    ]);
    chroniclesWhereMock.mockResolvedValueOnce([{ id: "chr-1", encounterId: DEMO_ENCOUNTER_ID }]);

    const outcome = await removeDemoEncounter();

    expect(outcome).toEqual({ removed: true });

    expect(chroniclesBulkDeleteMock).toHaveBeenCalledWith(["chr-1"]);
    expect(observationsBulkDeleteMock).toHaveBeenCalledWith(["obs-1"]);
    expect(mediaBulkDeleteMock).toHaveBeenCalledWith(["media-audio", "media-img-1", "media-img-2"]);
    expect(encountersDeleteMock).toHaveBeenCalledWith(DEMO_ENCOUNTER_ID);
    expect(participantsBulkDeleteMock).toHaveBeenCalledWith([
      DEMO_PARTICIPANT_ONE_ID,
      DEMO_PARTICIPANT_TWO_ID,
    ]);
    expect(groupsDeleteMock).toHaveBeenCalledWith(DEMO_GROUP_ID);
    expect(formsDeleteMock).toHaveBeenCalledWith(DEMO_FORM_ID);
    expect(fieldsBulkDeleteMock).toHaveBeenCalledWith([...DEMO_FIELD_IDS]);
  });

  it("returns removed:false when nothing matches but still cleans up stable IDs", async () => {
    encountersGetMock.mockResolvedValueOnce(undefined);
    observationsWhereMock.mockResolvedValueOnce([]);
    chroniclesWhereMock.mockResolvedValueOnce([]);

    const outcome = await removeDemoEncounter();

    expect(outcome).toEqual({ removed: false });

    // No bulk-deletes for empty arrays.
    expect(chroniclesBulkDeleteMock).not.toHaveBeenCalled();
    expect(observationsBulkDeleteMock).not.toHaveBeenCalled();
    expect(mediaBulkDeleteMock).not.toHaveBeenCalled();

    // Stable demo IDs are still attempted in case partial state remains.
    expect(encountersDeleteMock).toHaveBeenCalledWith(DEMO_ENCOUNTER_ID);
    expect(participantsBulkDeleteMock).toHaveBeenCalledWith([
      DEMO_PARTICIPANT_ONE_ID,
      DEMO_PARTICIPANT_TWO_ID,
    ]);
    expect(groupsDeleteMock).toHaveBeenCalledWith(DEMO_GROUP_ID);
    expect(formsDeleteMock).toHaveBeenCalledWith(DEMO_FORM_ID);
    expect(fieldsBulkDeleteMock).toHaveBeenCalledWith([...DEMO_FIELD_IDS]);
  });
});
