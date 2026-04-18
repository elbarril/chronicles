import Dexie, { type Table } from "dexie";

import { type Encounter } from "@/domain/encounter";
import { type Field } from "@/domain/field";
import { type ObservationForm } from "@/domain/form";
import { type Observation } from "@/domain/observation";
import { DB_VERSION, stores } from "@/infra/db/schema";

interface Institution {
  id: string;
  name: string;
  createdAt: string;
}

interface Group {
  id: string;
  institutionId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: "" | string;
}

interface Participant {
  id: string;
  groupId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: "" | string;
}

interface Media {
  id: string;
  mime: string;
  blob: Blob;
  size: number;
  createdAt: string;
}

export class ChronicleDB extends Dexie {
  institutions!: Table<Institution, string>;
  groups!: Table<Group, string>;
  participants!: Table<Participant, string>;
  fields!: Table<Field, string>;
  forms!: Table<ObservationForm, string>;
  encounters!: Table<Encounter, string>;
  observations!: Table<Observation, string>;
  media!: Table<Media, string>;

  constructor() {
    super("chronicle");

    const defaultInstitutionId = "00000000-0000-4000-8000-000000000001";
    const now = new Date().toISOString();

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

    this.version(DB_VERSION)
      .stores(stores)
      .upgrade(async (tx) => {
        const institutions = tx.table<Institution, string>("institutions");
        const existing = await institutions.toArray();

        if (existing.length > 0) {
          return;
        }

        await institutions.add({
          id: defaultInstitutionId,
          name: "Default",
          createdAt: now,
        });
      });
  }
}

export const db = new ChronicleDB();
