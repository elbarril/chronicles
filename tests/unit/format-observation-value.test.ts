import { describe, expect, it } from "vitest";

import { type Field } from "@/domain/field";
import { formatObservationValueAsText } from "@/features/observations/lib/format-observation-value";

const isoDate = "2026-04-30T12:00:00.000Z";

function makeField<T extends Field["type"]>(
  type: T,
  config: Extract<Field, { type: T }>["config"],
): Field {
  return {
    id: "00000000-0000-4000-8000-000000000aaa",
    type,
    key: "demo",
    label: "Demo",
    required: false,
    helpText: "",
    config,
    createdAt: isoDate,
    updatedAt: isoDate,
    archivedAt: "",
  } as Field;
}

const dateField = makeField("date", {});
const datetimeField = makeField("datetime", {});
const booleanField = makeField("boolean", {});
const textField = makeField("text", {});
const numberField = makeField("number", { min: 0, max: 100 });
const multiChoiceField = makeField("multiChoice", { options: ["a", "b"] });

describe("formatObservationValueAsText", () => {
  describe("date field", () => {
    it("renders YYYY-MM-DD using es-AR short date without timezone shifts", () => {
      const result = formatObservationValueAsText(dateField, "2026-04-30");

      // Date-only inputs should never roll back to the previous day, even
      // when the test machine is in a UTC- timezone.
      expect(result).toMatch(/30\/4\/(2026|26)/);
      expect(result).not.toMatch(/29\/4/);
    });

    it("returns empty label for missing or invalid date strings", () => {
      expect(formatObservationValueAsText(dateField, undefined)).toBe("Sin dato");
      expect(formatObservationValueAsText(dateField, "")).toBe("Sin dato");
      expect(formatObservationValueAsText(dateField, "no-es-fecha")).toBe("no-es-fecha");
    });
  });

  describe("datetime field", () => {
    it("renders ISO datetime using es-AR short date+time", () => {
      const result = formatObservationValueAsText(datetimeField, "2026-04-30T10:30");

      expect(result).toMatch(/30\/4\/(2026|26)/);
      expect(result).toMatch(/10:30/);
    });
  });

  describe("boolean field", () => {
    it("translates boolean values to rioplatense labels", () => {
      expect(formatObservationValueAsText(booleanField, true)).toBe("Verdadero");
      expect(formatObservationValueAsText(booleanField, false)).toBe("Falso");
    });

    it("translates booleans even when no field metadata is available", () => {
      expect(formatObservationValueAsText(undefined, true)).toBe("Verdadero");
      expect(formatObservationValueAsText(undefined, false)).toBe("Falso");
    });

    it("returns empty label when the value is not a real boolean", () => {
      expect(formatObservationValueAsText(booleanField, "true")).toBe("Sin dato");
    });
  });

  describe("scalar fallbacks", () => {
    it("renders text values as-is and falls back to empty label for blanks", () => {
      expect(formatObservationValueAsText(textField, "Algo")).toBe("Algo");
      expect(formatObservationValueAsText(textField, "  ")).toBe("Sin dato");
    });

    it("renders numbers using String()", () => {
      expect(formatObservationValueAsText(numberField, 42)).toBe("42");
    });

    it("joins arrays with commas", () => {
      expect(formatObservationValueAsText(multiChoiceField, ["a", "b"])).toBe("a, b");
      expect(formatObservationValueAsText(multiChoiceField, [])).toBe("Sin dato");
    });
  });

  describe("media values", () => {
    it("uses configurable single/multi labels", () => {
      const single = formatObservationValueAsText(undefined, { mediaId: "abc" });
      const multi = formatObservationValueAsText(undefined, { mediaIds: ["x", "y", "z"] });

      expect(single).toBe("Archivo multimedia adjunto");
      expect(multi).toBe("3 archivo(s) multimedia adjunto(s)");
    });

    it("respects custom empty/media labels passed by the caller", () => {
      const result = formatObservationValueAsText(textField, "", {
        emptyLabel: "—",
      });

      expect(result).toBe("—");
    });
  });
});
