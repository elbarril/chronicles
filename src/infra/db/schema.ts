export const DB_VERSION = 6;

export const stores = {
  institutions: "id, name, createdAt",
  groups: "id, institutionId, name, archivedAt, createdAt",
  participants: "id, groupId, displayName, archivedAt, createdAt",
  fields: "id, key, type, archivedAt, createdAt",
  forms: "id, name, version, archivedAt, createdAt",
  encounters: "id, groupId, formId, startedAt, endedAt, archivedAt, createdAt",
  observations: "id, encounterId, participantId, createdAt",
  media: "id, mime, createdAt",
  chronicles: "id, encounterId, generatedAt, createdAt",
} as const;
