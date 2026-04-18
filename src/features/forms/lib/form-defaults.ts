import { type ObservationFormInput } from "@/domain/form";

export function getDefaultFormInput(): ObservationFormInput {
  return {
    name: "",
    fieldIds: [],
  };
}
