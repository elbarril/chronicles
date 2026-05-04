import { type Field } from "@/domain/field";
import { type Observation } from "@/domain/observation";

// Minimal shape required to compute the hash — mirrors the non-key portion of
// GeminiChronicleInput so both the generator and the cache check use the same
// data surface without creating a circular import.
export interface ChronicleHashInput {
  encounter: {
    name: string;
    startsAt: string;
    endsAt: string;
    participantIds: string[];
  };
  projectName: string;
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
      for (const instance of obs.fields) {
        const field = input.fieldsById.get(instance.fieldId);
        if (!field || MEDIA_TYPES.has(field.type)) continue;
        scalarValues[instance.instanceId] = obs.values[instance.instanceId] ?? null;
      }
      return {
        formId: obs.formId,
        formVersion: obs.formVersion,
        fields: obs.fields.map((inst) => ({
          instanceId: inst.instanceId,
          fieldId: inst.fieldId,
          labelOverride: inst.labelOverride ?? null,
        })),
        participantId: obs.participantId ?? null,
        title: obs.title?.trim() ?? null,
        createdAt: obs.createdAt,
        values: scalarValues,
      };
    });

  return {
    name: input.encounter.name,
    startsAt: input.encounter.startsAt,
    endsAt: input.encounter.endsAt,
    participantIds: [...input.encounter.participantIds],
    projectName: input.projectName,
    observations: sortedObs,
  };
}

/**
 * Computes a SHA-256 fingerprint of the data that goes into a Gemini chronicle
 * prompt (excluding the API key and media fields).
 *
 * Two calls with the same encounter data and observations will produce the same
 * hash.  Any mutation — new observation, edited value, changed encounter
 * name, added participant, etc. — will produce a different hash.
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
