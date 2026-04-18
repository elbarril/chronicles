import { type GroupInput } from "@/domain/group";

export function getDefaultGroupInput(): GroupInput {
  return {
    name: "",
    participantNames: [""],
  };
}
