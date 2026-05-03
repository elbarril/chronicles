import { type EncounterInput } from "@/domain/encounter";

/**
 * Builds the default encounter input for the "create encounter" form.
 * Defaults `startsAt` to one hour ago and `endsAt` to "now", so the user
 * usually only needs to tweak the date pickers slightly to reflect the
 * actual session that already happened.
 */
export function getDefaultEncounterInput(projectId: string): EncounterInput {
  const now = new Date();
  const start = new Date(now.getTime() - 60 * 60 * 1000);

  return {
    projectId,
    name: "",
    startsAt: start.toISOString(),
    endsAt: now.toISOString(),
    participantIds: [],
  };
}
