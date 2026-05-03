import Dexie, { type Table } from "dexie";

import { type Chronicle } from "@/domain/chronicle";
import { type Encounter } from "@/domain/encounter";
import { type Field } from "@/domain/field";
import { type ObservationForm } from "@/domain/form";
import { type Observation } from "@/domain/observation";
import { type Participant } from "@/domain/participant";
import { type Project } from "@/domain/project";
import { DB_VERSION, stores } from "@/infra/db/schema";

interface Institution {
  id: string;
  name: string;
  createdAt: string;
}

interface Media {
  id: string;
  mime: string;
  blob: Blob;
  size: number;
  createdAt: string;
}

const DEFAULT_INSTITUTION_ID = "00000000-0000-4000-8000-000000000001";

export class ChronicleDB extends Dexie {
  institutions!: Table<Institution, string>;
  projects!: Table<Project, string>;
  participants!: Table<Participant, string>;
  fields!: Table<Field, string>;
  forms!: Table<ObservationForm, string>;
  encounters!: Table<Encounter, string>;
  observations!: Table<Observation, string>;
  media!: Table<Media, string>;
  chronicles!: Table<Chronicle, string>;

  constructor() {
    super("chronicle");

    // Historic schemas are kept solely so Dexie can upgrade pre-existing
    // databases up to v6, where the F9 hard reset takes over.
    this.version(2).stores({
      institutions: "id, name, createdAt",
      groups: "id, institutionId, name",
      participants: "id, groupId, displayName",
      fields: "id, key, type, archivedAt, createdAt",
      forms: "id, name, version, archivedAt",
      encounters: "id, groupId, formId, startedAt",
      observations: "id, encounterId, participantId, createdAt",
      media: "id, mime, createdAt",
    });

    this.version(3).stores({
      institutions: "id, name, createdAt",
      groups: "id, institutionId, name",
      participants: "id, groupId, displayName",
      fields: "id, key, type, archivedAt, createdAt",
      forms: "id, name, version, archivedAt, createdAt",
      encounters: "id, groupId, formId, startedAt",
      observations: "id, encounterId, participantId, createdAt",
      media: "id, mime, createdAt",
    });

    this.version(5).stores({
      institutions: "id, name, createdAt",
      groups: "id, institutionId, name, archivedAt, createdAt",
      participants: "id, groupId, displayName, archivedAt, createdAt",
      fields: "id, key, type, archivedAt, createdAt",
      forms: "id, name, version, archivedAt, createdAt",
      encounters: "id, groupId, formId, startedAt, endedAt, createdAt",
      observations: "id, encounterId, participantId, createdAt",
      media: "id, mime, createdAt",
      chronicles: "id, encounterId, generatedAt, createdAt",
    });

    this.version(6).stores({
      institutions: "id, name, createdAt",
      groups: "id, institutionId, name, archivedAt, createdAt",
      participants: "id, groupId, displayName, archivedAt, createdAt",
      fields: "id, key, type, archivedAt, createdAt",
      forms: "id, name, version, archivedAt, createdAt",
      encounters: "id, groupId, formId, startedAt, endedAt, archivedAt, createdAt",
      observations: "id, encounterId, participantId, createdAt",
      media: "id, mime, createdAt",
      chronicles: "id, encounterId, generatedAt, createdAt",
    });

    // F9: hard reset of every domain table touched by the projects refactor.
    // The legacy `groups` store is removed entirely; participants get a new
    // `projectId` shape; encounters, observations and chronicles are wiped
    // because their record shapes are incompatible with the new schema.
    this.version(DB_VERSION)
      .stores({
        ...stores,
        // Drop the legacy `groups` table by setting its schema to `null`.
        groups: null,
      })
      .upgrade(async (tx) => {
        // Wipe stale rows that no longer match the new shape. We cannot keep
        // them: domain Zod schemas now require fields the old rows do not
        // have (projectId, formId snapshot on observation, etc.).
        const tablesToWipe = ["participants", "encounters", "observations", "chronicles"] as const;

        for (const tableName of tablesToWipe) {
          await tx.table(tableName).clear();
        }

        const institutions = tx.table<Institution, string>("institutions");
        const existing = await institutions.toArray();

        if (existing.length === 0) {
          await institutions.add({
            id: DEFAULT_INSTITUTION_ID,
            name: "Default",
            createdAt: new Date().toISOString(),
          });
        }
      });

    // Ensure the default institution exists on a brand-new database too
    // (where no upgrade hook runs because version() tracking starts fresh).
    this.on("ready", async (db) => {
      const dexieDb = db as ChronicleDB;
      const existing = await dexieDb.institutions.get(DEFAULT_INSTITUTION_ID);

      if (!existing) {
        await dexieDb.institutions.put({
          id: DEFAULT_INSTITUTION_ID,
          name: "Default",
          createdAt: new Date().toISOString(),
        });
      }
    });
  }
}

export const db = new ChronicleDB();
