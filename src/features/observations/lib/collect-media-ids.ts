import { type Observation } from "@/domain/observation";

/**
 * Extracts every `mediaId` referenced by an observation across all of
 * its values, regardless of whether the value is a single media ref or
 * a list. Returns an empty array when no media is attached.
 */
export function collectObservationMediaIds(observation: Observation): string[] {
  return Object.values(observation.values).flatMap((value) => {
    if (typeof value !== "object" || value === null) {
      return [];
    }

    if ("mediaId" in value && typeof value.mediaId === "string") {
      return [value.mediaId];
    }

    if ("mediaIds" in value && Array.isArray(value.mediaIds)) {
      return value.mediaIds.filter((id): id is string => typeof id === "string");
    }

    return [];
  });
}
