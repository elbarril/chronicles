export const DB_VERSION = 4;

export const stores = {
  institutions: "id, name, createdAt",
  groups: "id, institutionId, name, archivedAt, createdAt",
  participants: "id, groupId, displayName, archivedAt, createdAt",
  fields: "id, key, type, archivedAt, createdAt",
  forms: "id, name, version, archivedAt, createdAt",
  encounters: "id, groupId, formId, startedAt, endedAt, createdAt",
  observations: "id, encounterId, participantId, createdAt",
  media: "id, mime, createdAt",
} as const;
