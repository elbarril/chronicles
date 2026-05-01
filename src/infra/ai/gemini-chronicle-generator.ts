import { type Encounter } from "@/domain/encounter";
import { type Field } from "@/domain/field";
import { type Observation } from "@/domain/observation";
import { formatObservationValueAsText } from "@/features/observations/lib/format-observation-value";
import { generateText } from "@/infra/ai/gemini-client";

export interface GeminiChronicleInput {
  apiKey: string;
  encounter: Encounter;
  groupName: string;
  participantsById: Map<string, string>;
  fieldsById: Map<string, Field>;
  observations: Observation[];
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function buildPrompt(input: Omit<GeminiChronicleInput, "apiKey">): string {
  const { encounter, groupName, participantsById, fieldsById, observations } = input;

  const sortedObservations = [...observations].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );

  const endedAt =
    encounter.endedAt && encounter.endedAt !== "" ? formatDateTime(encounter.endedAt) : "En curso";

  const observationsText =
    sortedObservations.length === 0
      ? "No se registraron observaciones para este encuentro."
      : sortedObservations
          .map((obs, index) => {
            const participantName = obs.participantId
              ? (participantsById.get(obs.participantId) ?? "Sin participante asignado")
              : "Sin participante asignado";

            const titleLine = obs.title?.trim() ? `\n   Título: ${obs.title.trim()}` : "";

            const fields = encounter.fieldIds
              .map((fieldId) => {
                const field = fieldsById.get(fieldId);
                if (!field) return null;
                const rawValue = obs.values[fieldId];
                // Skip media fields — they are not sent to the AI
                if (
                  field.type === "image" ||
                  field.type === "video" ||
                  field.type === "audio" ||
                  field.type === "file"
                ) {
                  return null;
                }
                const formatted = formatObservationValueAsText(field, rawValue);
                return `   - ${field.label}: ${formatted}`;
              })
              .filter(Boolean)
              .join("\n");

            return `${index + 1}. Participante: ${participantName}${titleLine}\n   Hora: ${formatDateTime(obs.createdAt)}\n${fields}`;
          })
          .join("\n\n");

  return `Sos un asistente especializado en documentación institucional de observaciones de grupos.
Tu tarea es generar una crónica narrativa en español rioplatense a partir de los datos de un encuentro de observación.

DATOS DEL ENCUENTRO:
- Actividad: ${encounter.activity}
- Grupo: ${groupName}
- Inicio: ${formatDateTime(encounter.startedAt)}
- Fin: ${endedAt}
- Total de observaciones: ${sortedObservations.length}

OBSERVACIONES REGISTRADAS:
${observationsText}

INSTRUCCIONES PARA LA CRÓNICA:
- Redactá en prosa clara, organizada y profesional en español rioplatense.
- Escribí en tercera persona, con tono descriptivo y objetivo.
- Organizá el relato de forma cronológica, mencionando a los participantes por su nombre cuando corresponda.
- Destacá patrones de comportamiento, interacciones relevantes y el desarrollo general del encuentro.
- Si hay observaciones con título, usalos como ejes temáticos para organizar la narrativa.
- No uses listas ni viñetas en la crónica final — solo texto corrido en párrafos.
- No repitas literalmente los datos de entrada: transformalos en una narrativa coherente.
- Extensión: entre 2 y 5 párrafos según la cantidad de observaciones.`;
}

export async function generateChronicleWithGemini(input: GeminiChronicleInput): Promise<string> {
  const { apiKey, ...rest } = input;
  const prompt = buildPrompt(rest);
  return generateText({ apiKey, prompt });
}
