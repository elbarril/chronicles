import { db } from "@/infra/db/client";

export interface DataStatusCounts {
  fields: number;
  forms: number;
  projects: number;
  encounters: number;
  observations: number;
  chronicles: number;
}

export interface DataStatus {
  counts: DataStatusCounts;
  hasData: boolean;
}

export async function getDataStatus(): Promise<DataStatus> {
  const [fields, forms, projects, encounters, observations, chronicles] = await Promise.all([
    db.fields.count(),
    db.forms.count(),
    db.projects.count(),
    db.encounters.count(),
    db.observations.count(),
    db.chronicles.count(),
  ]);

  const counts: DataStatusCounts = {
    fields,
    forms,
    projects,
    encounters,
    observations,
    chronicles,
  };

  const hasData = fields + forms + projects + encounters + observations + chronicles > 0;

  return { counts, hasData };
}
