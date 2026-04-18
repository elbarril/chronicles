import { describe, expect, it } from "vitest";

import { fieldFormSchema, fieldSchema } from "@/domain/field";

describe("field domain schemas", () => {
  it("accepts a valid single choice field", () => {
    const result = fieldSchema.safeParse({
      id: crypto.randomUUID(),
      key: "estado_animo",
      label: "Estado de ánimo",
      type: "singleChoice",
      required: true,
      helpText: "Elegí una opción",
      config: {
        options: ["Alto", "Medio", "Bajo"],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archivedAt: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects choice field without options", () => {
    const result = fieldFormSchema.safeParse({
      key: "estado",
      label: "Estado",
      type: "singleChoice",
      required: false,
      helpText: "",
      config: {
        options: [],
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid number min/max", () => {
    const result = fieldFormSchema.safeParse({
      key: "edad",
      label: "Edad",
      type: "number",
      required: false,
      helpText: "",
      config: {
        min: 20,
        max: 10,
      },
    });

    expect(result.success).toBe(false);
  });
});
