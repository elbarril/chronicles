import { z } from "zod";

export type ChronicleGeneratedWith = "deterministic" | "gemini";

export interface Chronicle {
  id: string;
  encounterId: string;
  title: string;
  body: string;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
  generatedWith?: ChronicleGeneratedWith;
  /** SHA-256 fingerprint of the prompt input used for Gemini generation.
   *  Present only when generatedWith === "gemini". Used to skip redundant
   *  API calls when the underlying observations have not changed. */
  inputHash?: string;
}

export const chronicleSchema = z.object({
  id: z.string().uuid(),
  encounterId: z.string().uuid(),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
  generatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  generatedWith: z.enum(["deterministic", "gemini"]).optional(),
  inputHash: z.string().optional(),
});

export const chronicleInputSchema = z.object({
  encounterId: z.string().uuid(),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
  generatedWith: z.enum(["deterministic", "gemini"]).optional(),
  inputHash: z.string().optional(),
});

export type ChronicleInput = z.infer<typeof chronicleInputSchema>;
