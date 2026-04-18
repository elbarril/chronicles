import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { type GroupWithParticipants } from "@/features/groups/services/group-service";

interface GroupListTableProps {
  groups: GroupWithParticipants[];
  status: "active" | "archived";
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
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

export function GroupListTable({
  groups,
  status,
  onArchive,
  onRestore,
}: GroupListTableProps): JSX.Element {
  if (groups.length === 0) {
    return (
      <div className="border-border bg-card rounded-md border p-6 text-center">
        <p className="text-muted-foreground mb-4">
          {status === "active"
            ? "Todavía no hay grupos activos."
            : "No hay grupos archivados para mostrar."}
        </p>
        {status === "active" ? (
          <Button asChild>
            <Link to="/groups/new">Crear primer grupo</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <table className="w-full min-w-[700px] border-collapse text-sm">
        <caption className="sr-only">Listado de grupos</caption>
        <thead className="bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Nombre</th>
            <th className="px-3 py-2 text-left font-medium">Participantes</th>
            <th className="px-3 py-2 text-left font-medium">Creado</th>
            <th className="px-3 py-2 text-left font-medium">Estado</th>
            <th className="px-3 py-2 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id} className="border-border border-t">
              <td className="px-3 py-2 align-top font-medium">{group.name}</td>
              <td className="px-3 py-2 align-top">{group.participants.length}</td>
              <td className="px-3 py-2 align-top">{formatDate(group.createdAt)}</td>
              <td className="px-3 py-2 align-top">{group.archivedAt ? "Archivado" : "Activo"}</td>
              <td className="px-3 py-2 align-top">
                <div className="flex justify-end gap-2">
                  {status === "active" ? (
                    <>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/groups/${group.id}/edit`}>Editar</Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          void onArchive(group.id);
                        }}
                      >
                        Archivar
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void onRestore(group.id);
                      }}
                    >
                      Restaurar
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
