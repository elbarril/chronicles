import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { type Encounter } from "@/domain/encounter";

interface EncounterListTableProps {
  encounters: Encounter[];
  status: "inProgress" | "finished" | "archived";
  onGenerateChronicle: (encounterId: string) => void | Promise<void>;
  onArchive: (encounterId: string) => void | Promise<void>;
  onRestore: (encounterId: string) => void | Promise<void>;
  isGeneratingChronicleId?: string;
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

function EncounterActions({
  encounter,
  status,
  onGenerateChronicle,
  onArchive,
  onRestore,
  isGeneratingChronicleId,
}: {
  encounter: Encounter;
  status: "inProgress" | "finished" | "archived";
  onGenerateChronicle: (encounterId: string) => void | Promise<void>;
  onArchive: (encounterId: string) => void | Promise<void>;
  onRestore: (encounterId: string) => void | Promise<void>;
  isGeneratingChronicleId?: string;
}): JSX.Element {
  const isArchived = status === "archived";
  const isGeneratingThis = isGeneratingChronicleId === encounter.id;

  return (
    <>
      <Button asChild size="sm" variant="outline">
        <Link to={`/encounters/${encounter.id}`}>Abrir</Link>
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isGeneratingThis}
        onClick={() => {
          void onGenerateChronicle(encounter.id);
        }}
      >
        {isGeneratingThis ? "Generando..." : "Generar crónica"}
      </Button>
      {isArchived ? (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            void onRestore(encounter.id);
          }}
        >
          Restaurar
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            void onArchive(encounter.id);
          }}
        >
          Archivar
        </Button>
      )}
    </>
  );
}

export function EncounterListTable({
  encounters,
  status,
  onGenerateChronicle,
  onArchive,
  onRestore,
  isGeneratingChronicleId,
}: EncounterListTableProps): JSX.Element {
  if (encounters.length === 0) {
    const emptyMessage =
      status === "inProgress"
        ? "No hay encuentros en curso."
        : status === "finished"
          ? "No hay encuentros finalizados para mostrar."
          : "No hay encuentros archivados.";

    return (
      <div className="bg-muted/40 rounded-3xl p-6 text-center">
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        {status === "inProgress" ? (
          <Button asChild>
            <Link to="/encounters/new">Crear primer encuentro</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {/* Mobile / tablet: cards */}
      <ul className="grid gap-3 lg:hidden" aria-label="Listado de encuentros">
        {encounters.map((encounter) => (
          <li key={encounter.id} className="bg-muted/40 space-y-3 rounded-2xl p-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">
                <Link
                  to={`/encounters/${encounter.id}`}
                  className="hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {encounter.activity}
                </Link>
              </p>
              <p className="text-muted-foreground text-xs">
                Iniciado: {formatDate(encounter.startedAt)}
              </p>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Finalizado:</dt>
                <dd>{formatDate(encounter.endedAt ?? "")}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Versión form:</dt>
                <dd>v{encounter.formVersion}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 pt-1">
              <EncounterActions
                encounter={encounter}
                status={status}
                onGenerateChronicle={onGenerateChronicle}
                onArchive={onArchive}
                onRestore={onRestore}
                isGeneratingChronicleId={isGeneratingChronicleId}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Listado de encuentros</caption>
          <thead>
            <tr className="text-muted-foreground text-xs tracking-wide uppercase">
              <th className="px-3 py-2 text-left font-medium">Actividad</th>
              <th className="px-3 py-2 text-left font-medium">Iniciado</th>
              <th className="px-3 py-2 text-left font-medium">Finalizado</th>
              <th className="px-3 py-2 text-left font-medium">Versión form</th>
              <th className="px-3 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {encounters.map((encounter) => (
              <tr key={encounter.id} className="border-border/60 border-t">
                <td className="px-3 py-3 align-middle font-medium">
                  <Link
                    to={`/encounters/${encounter.id}`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {encounter.activity}
                  </Link>
                </td>
                <td className="text-muted-foreground px-3 py-3 align-middle">
                  {formatDate(encounter.startedAt)}
                </td>
                <td className="text-muted-foreground px-3 py-3 align-middle">
                  {formatDate(encounter.endedAt ?? "")}
                </td>
                <td className="px-3 py-3 align-middle">v{encounter.formVersion}</td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex flex-wrap justify-end gap-2">
                    <EncounterActions
                      encounter={encounter}
                      status={status}
                      onGenerateChronicle={onGenerateChronicle}
                      onArchive={onArchive}
                      onRestore={onRestore}
                      isGeneratingChronicleId={isGeneratingChronicleId}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
