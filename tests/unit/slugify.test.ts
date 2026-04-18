import { describe, expect, it } from "vitest";

import { slugifyLabel } from "@/lib/slugify";

describe("slugifyLabel", () => {
  it("normalizes accents and spaces", () => {
    expect(slugifyLabel("Estado de ánimo")).toBe("estado_de_animo");
  });

  it("removes unsupported symbols", () => {
    expect(slugifyLabel("Nivel #1 (grupo A)")).toBe("nivel_1_grupo_a");
  });

  it("trims separators", () => {
    expect(slugifyLabel("   _Hola   mundo- ")).toBe("hola_mundo");
  });
});
