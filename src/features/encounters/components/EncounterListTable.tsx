import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { type Encounter } from "@/domain/encounter";

interface EncounterListTableProps {
  encounters: Encounter[];
  status: "inProgress" | "finished";
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

export function EncounterListTable({ encounters, status }: EncounterListTableProps): JSX.Element {
  if (encounters.length === 0) {
    return (
      <div className="border-border bg-card rounded-md border p-6 text-center">
        <p className="text-muted-foreground mb-4">
          {status === "inProgress"
            ? "No hay encuentros en curso."
            : "No hay encuentros finalizados para mostrar."}
        </p>
        {status === "inProgress" ? (
          <Button asChild>
            <Link to="/encounters/new">Crear primer encuentro</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <table className="w-full min-w-[700px] border-collapse text-sm">
        <caption className="sr-only">Listado de encuentros</caption>
        <thead className="bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Actividad</th>
            <th className="px-3 py-2 text-left font-medium">Iniciado</th>
            <th className="px-3 py-2 text-left font-medium">Finalizado</th>
            <th className="px-3 py-2 text-left font-medium">Versión form</th>
            <th className="px-3 py-2 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {encounters.map((encounter) => (
            <tr key={encounter.id} className="border-border border-t">
              <td className="px-3 py-2 align-top font-medium">{encounter.activity}</td>
              <td className="px-3 py-2 align-top">{formatDate(encounter.startedAt)}</td>
              <td className="px-3 py-2 align-top">{formatDate(encounter.endedAt ?? "")}</td>
              <td className="px-3 py-2 align-top">v{encounter.formVersion}</td>
              <td className="px-3 py-2 align-top">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/encounters/${encounter.id}`}>Abrir</Link>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
