import { type ProjectInput } from "@/domain/project";

export function getDefaultProjectInput(): ProjectInput {
  return {
    name: "",
    participants: [{ displayName: "" }],
  };
}
