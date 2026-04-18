export const DB_VERSION = 1;

export const stores = {
  institutions: "id, name, createdAt",
  groups: "id, institutionId, name",
  participants: "id, groupId, displayName",
  fields: "id, key, type, archivedAt",
  forms: "id, name, version, archivedAt",
  encounters: "id, groupId, formId, startedAt",
  observations: "id, encounterId, participantId, createdAt",
  media: "id, mime, createdAt",
} as const;
