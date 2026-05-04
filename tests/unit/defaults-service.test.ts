import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_AUDIO_FIELD_ID,
  DEFAULT_FORM_ID,
  DEFAULT_LONG_TEXT_FIELD_ID,
} from "@/features/defaults/lib/seed-data";
import {
  restoreDefaultFields,
  restoreDefaultForm,
  seedDefaultsIfMissing,
} from "@/features/defaults/services/defaults-service";

const {
  fieldsBulkGetMock,
  fieldsAddMock,
  fieldsUpdateMock,
  formsBulkGetMock,
  formsGetMock,
  formsAddMock,
  formsUpdateMock,
} = vi.hoisted(() => ({
  fieldsBulkGetMock: vi.fn(),
  fieldsAddMock: vi.fn(),
  fieldsUpdateMock: vi.fn(),
  formsBulkGetMock: vi.fn(),
  formsGetMock: vi.fn(),
  formsAddMock: vi.fn(),
  formsUpdateMock: vi.fn(),
}));

vi.mock("@/infra/db/client", () => {
  type TransactionFn = () => Promise<unknown>;

  return {
    db: {
      transaction: (_mode: string, ..._args: unknown[]) => {
        const fn = _args[_args.length - 1] as TransactionFn;
        return fn();
      },
      fields: {
        bulkGet: fieldsBulkGetMock,
        add: fieldsAddMock,
        update: fieldsUpdateMock,
      },
      forms: {
        bulkGet: formsBulkGetMock,
        get: formsGetMock,
        add: formsAddMock,
        update: formsUpdateMock,
      },
    },
  };
});

const archivedAt = "2026-04-30T18:00:00.000Z";

function archivedRow(id: string) {
  return {
    id,
    type: "audio",
    key: "k",
    label: "L",
    required: false,
    helpText: "",
    config: { multiple: false },
    archivedAt,
    createdAt: archivedAt,
    updatedAt: archivedAt,
  };
}

function activeFieldRow(id: string) {
  return {
    ...archivedRow(id),
    archivedAt: "",
  };
}

describe("defaults service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("seedDefaultsIfMissing", () => {
    it("creates every default when none exist", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([undefined, undefined]);
      formsGetMock.mockResolvedValueOnce(undefined);

      await seedDefaultsIfMissing();

      expect(fieldsAddMock).toHaveBeenCalledTimes(2);
      expect(formsAddMock).toHaveBeenCalledTimes(1);

      const addedIds = fieldsAddMock.mock.calls.map((call) => call[0].id);
      expect(addedIds).toEqual(
        expect.arrayContaining([DEFAULT_AUDIO_FIELD_ID, DEFAULT_LONG_TEXT_FIELD_ID]),
      );

      const formArg = formsAddMock.mock.calls[0]?.[0];
      expect(formArg.id).toBe(DEFAULT_FORM_ID);
      expect(formArg.fields.map((f: { fieldId: string }) => f.fieldId)).toEqual([
        DEFAULT_AUDIO_FIELD_ID,
        DEFAULT_LONG_TEXT_FIELD_ID,
      ]);
    });

    it("does nothing when all defaults already exist (even archived)", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([
        archivedRow(DEFAULT_AUDIO_FIELD_ID),
        activeFieldRow(DEFAULT_LONG_TEXT_FIELD_ID),
      ]);
      formsGetMock.mockResolvedValueOnce({
        id: DEFAULT_FORM_ID,
        name: "Observación de encuentro",
        fieldIds: [DEFAULT_AUDIO_FIELD_ID, DEFAULT_LONG_TEXT_FIELD_ID],
        version: 1,
        archivedAt: "",
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });

      await seedDefaultsIfMissing();

      expect(fieldsAddMock).not.toHaveBeenCalled();
      expect(formsAddMock).not.toHaveBeenCalled();
    });

    it("only creates the missing pieces", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([activeFieldRow(DEFAULT_AUDIO_FIELD_ID), undefined]);
      formsGetMock.mockResolvedValueOnce(undefined);

      await seedDefaultsIfMissing();

      expect(fieldsAddMock).toHaveBeenCalledTimes(1);
      expect(fieldsAddMock.mock.calls[0]?.[0].id).toBe(DEFAULT_LONG_TEXT_FIELD_ID);
      expect(formsAddMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("restoreDefaultFields", () => {
    it("creates missing fields and restores archived ones", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([archivedRow(DEFAULT_AUDIO_FIELD_ID), undefined]);
      fieldsUpdateMock.mockResolvedValue(1);

      const outcome = await restoreDefaultFields();

      expect(outcome).toEqual({ created: 1, restored: 1, unchanged: 0 });
      expect(fieldsUpdateMock).toHaveBeenCalledWith(
        DEFAULT_AUDIO_FIELD_ID,
        expect.objectContaining({ archivedAt: "" }),
      );
      expect(fieldsAddMock).toHaveBeenCalledTimes(1);
      expect(fieldsAddMock.mock.calls[0]?.[0].id).toBe(DEFAULT_LONG_TEXT_FIELD_ID);
    });

    it("leaves active fields untouched", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([
        activeFieldRow(DEFAULT_AUDIO_FIELD_ID),
        activeFieldRow(DEFAULT_LONG_TEXT_FIELD_ID),
      ]);

      const outcome = await restoreDefaultFields();

      expect(outcome).toEqual({ created: 0, restored: 0, unchanged: 2 });
      expect(fieldsAddMock).not.toHaveBeenCalled();
      expect(fieldsUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe("restoreDefaultForm", () => {
    it("restores the archived form after restoring the fields", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([
        activeFieldRow(DEFAULT_AUDIO_FIELD_ID),
        activeFieldRow(DEFAULT_LONG_TEXT_FIELD_ID),
      ]);
      formsGetMock.mockResolvedValueOnce({
        id: DEFAULT_FORM_ID,
        name: "Observación de encuentro",
        fieldIds: [DEFAULT_AUDIO_FIELD_ID, DEFAULT_LONG_TEXT_FIELD_ID],
        version: 1,
        archivedAt,
        createdAt: archivedAt,
        updatedAt: archivedAt,
      });
      formsUpdateMock.mockResolvedValue(1);

      const outcome = await restoreDefaultForm();

      expect(outcome.restored).toBe(1);
      expect(outcome.created).toBe(0);
      expect(formsUpdateMock).toHaveBeenCalledWith(
        DEFAULT_FORM_ID,
        expect.objectContaining({ archivedAt: "" }),
      );
    });

    it("creates the form when missing and ensures fields exist", async () => {
      fieldsBulkGetMock.mockResolvedValueOnce([undefined, undefined]);
      formsGetMock.mockResolvedValueOnce(undefined);

      const outcome = await restoreDefaultForm();

      expect(outcome.created).toBe(1);
      expect(outcome.fields.created).toBe(2);
      expect(formsAddMock).toHaveBeenCalledTimes(1);
      expect(
        formsAddMock.mock.calls[0]?.[0].fields.map((f: { fieldId: string }) => f.fieldId),
      ).toEqual([DEFAULT_AUDIO_FIELD_ID, DEFAULT_LONG_TEXT_FIELD_ID]);
    });
  });
});
