import { type EncounterInput } from "@/domain/encounter";

export function getDefaultEncounterInput(): EncounterInput {
  return {
    groupId: "",
    formId: "",
    activity: "",
  };
}
