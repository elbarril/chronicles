import { Button } from "@/components/ui/button";
import { type Encounter } from "@/domain/encounter";

interface EncounterHeaderProps {
  encounter: Encounter;
  participantCount: number;
  onFinish: () => Promise<void>;
  onExport: () => Promise<void>;
  onGenerateChronicle: () => Promise<void>;
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
  isExporting,
  isGeneratingChronicle,
  exportLabel,
  generateChronicleLabel,
  generatingChronicleLabel,
}: EncounterHeaderProps): JSX.Element {
  const isFinished = Boolean(encounter.endedAt && encounter.endedAt !== "");

  return (
    <header className="border-border bg-card space-y-4 rounded-md border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{encounter.activity}</h1>
          <p className="text-muted-foreground text-sm">
            Formulario snapshot v{encounter.formVersion} · {encounter.fieldIds.length} campos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
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
              onClick={() => {
                void onFinish();
              }}
            >
              Finalizar encuentro
            </Button>
          ) : (
            <span className="text-sm font-medium">Encuentro finalizado</span>
          )}
        </div>
      </div>

      <dl className="grid gap-2 text-sm md:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Iniciado</dt>
          <dd>{formatDate(encounter.startedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Finalizado</dt>
          <dd>{formatDate(encounter.endedAt ?? "")}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Participantes</dt>
          <dd>{participantCount}</dd>
        </div>
      </dl>
    </header>
  );
}
