export const DB_VERSION = 7;

export const stores = {
  institutions: "id, name, createdAt",
  projects: "id, institutionId, name, archivedAt, createdAt",
  participants: "id, projectId, displayName, archivedAt, createdAt",
  fields: "id, key, type, archivedAt, createdAt",
  forms: "id, name, version, archivedAt, createdAt",
  encounters: "id, projectId, startsAt, archivedAt, createdAt",
  observations: "id, encounterId, formId, participantId, createdAt",
  media: "id, mime, createdAt",
  chronicles: "id, encounterId, generatedAt, createdAt",
} as const;
