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
}

interface Participant {
  id: string;
  groupId: string;
  displayName: string;
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

    this.version(DB_VERSION).stores(stores);
  }
}

export const db = new ChronicleDB();
