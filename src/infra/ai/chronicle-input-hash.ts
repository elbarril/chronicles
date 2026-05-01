import { type Field } from "@/domain/field";
import { type Observation } from "@/domain/observation";

// Minimal shape required to compute the hash — mirrors the non-key portion of
// GeminiChronicleInput so both the generator and the cache check use the same
// data surface without creating a circular import.
export interface ChronicleHashInput {
  encounter: {
    activity: string;
    startedAt: string;
    endedAt?: string;
    fieldIds: string[];
  };
  groupName: string;
  participantsById: Map<string, string>;
  fieldsById: Map<string, Field>;
  observations: Observation[];
}

const MEDIA_TYPES = new Set(["image", "video", "audio", "file"]);

function toHashableObject(input: ChronicleHashInput): object {
  // Sort observations the same way the Gemini prompt does (chronological).
  const sortedObs = [...input.observations]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((obs) => {
      // Only include scalar field values — media fields are excluded from the
      // Gemini prompt and therefore must not affect the hash either.
      const scalarValues: Record<string, unknown> = {};
      for (const fieldId of input.encounter.fieldIds) {
        const field = input.fieldsById.get(fieldId);
        if (!field || MEDIA_TYPES.has(field.type)) continue;
        scalarValues[fieldId] = obs.values[fieldId] ?? null;
      }
      return {
        participantId: obs.participantId ?? null,
        title: obs.title?.trim() ?? null,
        createdAt: obs.createdAt,
        values: scalarValues,
      };
    });

  return {
    activity: input.encounter.activity,
    startedAt: input.encounter.startedAt,
    endedAt: input.encounter.endedAt ?? "",
    fieldIds: [...input.encounter.fieldIds],
    groupName: input.groupName,
    observations: sortedObs,
  };
}

/**
 * Computes a SHA-256 fingerprint of the data that goes into a Gemini chronicle
 * prompt (excluding the API key and media fields).
 *
 * Two calls with the same encounter data and observations will produce the same
 * hash.  Any mutation — new observation, edited value, changed encounter
 * activity, added participant, etc. — will produce a different hash.
 */
export async function computeChronicleInputHash(input: ChronicleHashInput): Promise<string> {
  const obj = toHashableObject(input);
  const json = JSON.stringify(obj);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(json);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
