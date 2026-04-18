import {
  importEncounterData,
  parseEncounterZip,
  type EncounterImportData,
  type EncounterImportPreview,
} from "@/infra/export/encounter-importer";

export async function parseZipForImport(file: File): Promise<EncounterImportPreview> {
  return parseEncounterZip(file);
}

export async function confirmZipImport(data: EncounterImportData): Promise<void> {
  await importEncounterData(data);
}
