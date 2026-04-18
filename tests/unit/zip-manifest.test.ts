import { describe, expect, it } from "vitest";

import { encounterZipManifestSchema, MANIFEST_SCHEMA } from "@/infra/export/manifest";

describe("encounter ZIP manifest schema", () => {
  it("accepts a valid manifest payload", () => {
    const result = encounterZipManifestSchema.safeParse({
      schema: MANIFEST_SCHEMA,
      exportedAt: new Date().toISOString(),
      encounterActivity: "Actividad de prueba",
      groupName: "Grupo A",
      startedAt: new Date().toISOString(),
      endedAt: "",
      observationCount: 3,
      mediaIndex: [
        {
          id: crypto.randomUUID(),
          mime: "image/png",
          size: 123,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown schema versions", () => {
    const result = encounterZipManifestSchema.safeParse({
      schema: "chronicle-encounter-v2",
      exportedAt: new Date().toISOString(),
      encounterActivity: "Actividad",
      groupName: "Grupo A",
      startedAt: new Date().toISOString(),
      endedAt: "",
      observationCount: 0,
      mediaIndex: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = encounterZipManifestSchema.safeParse({
      schema: MANIFEST_SCHEMA,
      encounterActivity: "Actividad",
    });

    expect(result.success).toBe(false);
  });
});
