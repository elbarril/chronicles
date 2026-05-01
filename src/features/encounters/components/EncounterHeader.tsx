import { Button } from "@/components/ui/button";
import { type Encounter } from "@/domain/encounter";

interface EncounterHeaderProps {
  encounter: Encounter;
  participantCount: number;
  onFinish: () => Promise<void>;
  onExport: () => Promise<void>;
  onGenerateChronicle: () => Promise<void>;
  onArchive: () => Promise<void>;
  onRestore: () => Promise<void>;
  isExporting: boolean;
  isGeneratingChronicle: boolean;
  exportLabel: string;
  generateChronicleLabel: string;
  generatingChronicleLabel: string;
}

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function EncounterHeader({
  encounter,
  participantCount,
  onFinish,
  onExport,
  onGenerateChronicle,
  onArchive,
  onRestore,
  isExporting,
  isGeneratingChronicle,
  exportLabel,
  generateChronicleLabel,
  generatingChronicleLabel,
}: EncounterHeaderProps): JSX.Element {
  const isFinished = Boolean(encounter.endedAt && encounter.endedAt !== "");
  const isArchived = Boolean(encounter.archivedAt && encounter.archivedAt !== "");

  return (
    <header className="border-border bg-card flex flex-col gap-4 rounded-md border p-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight break-words">{encounter.activity}</h1>
        <p className="text-muted-foreground text-sm">
          Formulario snapshot v{encounter.formVersion} · {encounter.fieldIds.length} campos
        </p>
        {isArchived ? <p className="text-muted-foreground text-xs">Archivado</p> : null}
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Iniciado</dt>
          <dd>{formatDate(encounter.startedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Finalizado</dt>
          <dd>{formatDate(encounter.endedAt ?? "")}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-muted-foreground">Participantes</dt>
          <dd>{participantCount}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isGeneratingChronicle}
          onClick={() => {
            void onGenerateChronicle();
          }}
        >
          {isGeneratingChronicle ? generatingChronicleLabel : generateChronicleLabel}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isExporting}
          onClick={() => {
            void onExport();
          }}
        >
          {isExporting ? "Exportando..." : exportLabel}
        </Button>

        {!isFinished ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              void onFinish();
            }}
          >
            Finalizar encuentro
          </Button>
        ) : (
          <span className="text-muted-foreground self-center text-sm font-medium">
            Encuentro finalizado
          </span>
        )}

        {isArchived ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              void onRestore();
            }}
          >
            Restaurar encuentro
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              void onArchive();
            }}
          >
            Archivar encuentro
          </Button>
        )}
      </div>
    </header>
  );
}
