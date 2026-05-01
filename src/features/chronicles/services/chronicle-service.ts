import { type Chronicle } from "@/domain/chronicle";
import { type Encounter } from "@/domain/encounter";
import { type Field } from "@/domain/field";
import { formatObservationValueAsText } from "@/features/observations/lib/format-observation-value";
import { hasGeminiApiKey, getGeminiApiKey } from "@/features/settings/services/settings-service";
import { computeChronicleInputHash } from "@/infra/ai/chronicle-input-hash";
import { generateChronicleWithGemini } from "@/infra/ai/gemini-chronicle-generator";
import {
  deleteChronicle,
  getChronicleByEncounterId,
  getChronicleById,
  listChronicles,
  upsertChronicleByEncounter,
} from "@/infra/db/repositories/chronicle-repository";
import { getEncounterById } from "@/infra/db/repositories/encounter-repository";
import { listFieldsByIds } from "@/infra/db/repositories/field-repository";
import { getGroupById, listParticipantsByGroup } from "@/infra/db/repositories/group-repository";
import { listObservationsByEncounter } from "@/infra/db/repositories/observation-repository";
import { AppError, type ErrorCode } from "@/lib/error";

export interface ChronicleListItem {
  chronicle: Chronicle;
  encounter?: Encounter;
}

export async function getChronicleForEncounter(
  encounterId: string,
): Promise<Chronicle | undefined> {
  return getChronicleByEncounterId(encounterId);
}

export interface ChronicleDetail {
  chronicle: Chronicle;
  encounter?: Encounter;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function buildChronicleBody(input: {
  encounter: Encounter;
  groupName: string;
  participantsById: Map<string, string>;
  fieldsById: Map<string, Field>;
  observations: Awaited<ReturnType<typeof listObservationsByEncounter>>;
}): string {
  const sortedObservations = [...input.observations].sort((left, right) =>
    left.createdAt.localeCompare(right.createdAt),
  );

  const lines: string[] = [
    "Resumen del encuentro",
    `- Grupo: ${input.groupName}`,
    `- Actividad: ${input.encounter.activity}`,
    `- Inicio: ${formatDateTime(input.encounter.startedAt)}`,
    `- Fin: ${
      input.encounter.endedAt && input.encounter.endedAt !== ""
        ? formatDateTime(input.encounter.endedAt)
        : "En curso"
    }`,
    `- Observaciones registradas: ${sortedObservations.length}`,
    "",
    "Detalle de observaciones",
  ];

  if (sortedObservations.length === 0) {
    lines.push("- No hay observaciones registradas para este encuentro.");
    return lines.join("\n");
  }

  sortedObservations.forEach((observation, index) => {
    const participantName = observation.participantId
      ? input.participantsById.get(observation.participantId)
      : undefined;

    const titleSuffix = observation.title?.trim() ? ` · ${observation.title.trim()}` : "";

    lines.push(
      "",
      `Observación ${index + 1}${titleSuffix}`,
      `- Fecha: ${formatDateTime(observation.createdAt)}`,
      `- Participante: ${participantName ?? "Sin participante asignado"}`,
    );

    input.encounter.fieldIds.forEach((fieldId) => {
      const field = input.fieldsById.get(fieldId);

      if (!field) {
        return;
      }

      const rawValue = observation.values[fieldId];
      const formattedValue = formatObservationValueAsText(field, rawValue);

      lines.push(`- ${field.label}: ${formattedValue}`);
    });
  });

  return lines.join("\n");
}

function buildChronicleTitle(encounter: Encounter): string {
  return `Crónica · ${encounter.activity}`;
}

export interface GenerateChronicleOptions {
  /**
   * When true, skip the cache check and always call the Gemini API.
   * Used by the "Regenerar crónica" action so the user can explicitly
   * request a fresh narrative even when the observations have not changed.
   */
  force?: boolean;
}

export interface GenerateChronicleResult {
  chronicle: Chronicle;
  usedAi: boolean;
  aiFailed: boolean;
  aiFailCode?: ErrorCode;
}

export async function generateChronicle(
  encounterId: string,
  options: GenerateChronicleOptions = {},
): Promise<GenerateChronicleResult> {
  const encounter = await getEncounterById(encounterId);

  if (!encounter) {
    throw new AppError(
      "CHRONICLE_ENCOUNTER_REQUIRED",
      "Encounter is required to generate chronicle.",
    );
  }

  const [group, participants, fields, observations] = await Promise.all([
    getGroupById(encounter.groupId),
    listParticipantsByGroup(encounter.groupId),
    listFieldsByIds(encounter.fieldIds),
    listObservationsByEncounter(encounter.id),
  ]);

  if (!group) {
    throw new AppError("CHRONICLE_GENERATION_FAILED", "Group not found for chronicle generation.");
  }

  const participantsById = new Map(
    participants.map((participant) => [participant.id, participant.displayName]),
  );
  const fieldsById = new Map(fields.map((field) => [field.id, field]));
  const title = buildChronicleTitle(encounter);

  // Attempt Gemini generation if API key is configured
  let aiFailCode: ErrorCode | undefined;

  if (hasGeminiApiKey()) {
    const apiKey = getGeminiApiKey();
    if (apiKey) {
      const hashInput = {
        encounter,
        groupName: group.name,
        participantsById,
        fieldsById,
        observations,
      };

      // Cache check: if the observations haven't changed since the last Gemini
      // generation, return the existing chronicle without consuming API quota.
      // The user can bypass this with force=true (e.g. "Regenerar" button).
      if (!options.force) {
        const existing = await getChronicleByEncounterId(encounterId);
        if (existing?.generatedWith === "gemini" && existing.inputHash) {
          const currentHash = await computeChronicleInputHash(hashInput);
          if (existing.inputHash === currentHash) {
            return { chronicle: existing, usedAi: true, aiFailed: false };
          }
        }
      }

      try {
        const inputHash = await computeChronicleInputHash(hashInput);
        const aiBody = await generateChronicleWithGemini({
          apiKey,
          encounter,
          groupName: group.name,
          participantsById,
          fieldsById,
          observations,
        });

        const chronicle = await upsertChronicleByEncounter({
          encounterId: encounter.id,
          title,
          body: aiBody,
          generatedWith: "gemini",
          inputHash,
        });

        return { chronicle, usedAi: true, aiFailed: false };
      } catch (aiError) {
        // Capture the specific error code to surface a meaningful toast
        aiFailCode = aiError instanceof AppError ? aiError.code : "AI_GENERATION_FAILED";
      }
    }
  }

  // Deterministic fallback (always available)
  const body = buildChronicleBody({
    encounter,
    groupName: group.name,
    participantsById,
    fieldsById,
    observations,
  });

  const chronicle = await upsertChronicleByEncounter({
    encounterId: encounter.id,
    title,
    body,
    generatedWith: "deterministic",
  });

  const aiFailed = hasGeminiApiKey();
  return { chronicle, usedAi: false, aiFailed, aiFailCode };
}

export async function listGeneratedChronicles(): Promise<ChronicleListItem[]> {
  const chronicles = await listChronicles();

  const encounters = await Promise.all(
    chronicles.map((chronicle) => getEncounterById(chronicle.encounterId)),
  );

  return chronicles.map((chronicle, index) => ({
    chronicle,
    encounter: encounters[index],
  }));
}

export async function getChronicleDetail(chronicleId: string): Promise<ChronicleDetail> {
  const chronicle = await getChronicleById(chronicleId);

  if (!chronicle) {
    throw new AppError("CHRONICLE_NOT_FOUND", "Chronicle not found.");
  }

  const encounter = await getEncounterById(chronicle.encounterId);

  return {
    chronicle,
    encounter,
  };
}

export async function removeChronicle(chronicleId: string): Promise<void> {
  const deleted = await deleteChronicle(chronicleId);

  if (!deleted) {
    throw new AppError("CHRONICLE_NOT_FOUND", "Chronicle not found for delete.");
  }
}
