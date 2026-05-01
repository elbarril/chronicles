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

function GroupActions({
  group,
  status,
  onArchive,
  onRestore,
}: {
  group: GroupWithParticipants;
  status: "active" | "archived";
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
}): JSX.Element {
  if (status === "active") {
    return (
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
    );
  }

  return (
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
  );
}

export function GroupListTable({
  groups,
  status,
  onArchive,
  onRestore,
}: GroupListTableProps): JSX.Element {
  if (groups.length === 0) {
    return (
      <div className="bg-muted/40 rounded-3xl p-6 text-center">
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
    <>
      {/* Mobile / tablet: cards */}
      <ul className="grid gap-3 lg:hidden" aria-label="Listado de grupos">
        {groups.map((group) => (
          <li key={group.id} className="bg-muted/40 space-y-3 rounded-2xl p-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">
                <Link
                  to={`/groups/${group.id}/edit`}
                  className="hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {group.name}
                </Link>
              </p>
              <p className="text-muted-foreground text-xs">
                {group.archivedAt ? "Archivado" : "Activo"} · {formatDate(group.createdAt)}
              </p>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Participantes:</dt>
                <dd>{group.participants.length}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 pt-1">
              <GroupActions
                group={group}
                status={status}
                onArchive={onArchive}
                onRestore={onRestore}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Listado de grupos</caption>
          <thead>
            <tr className="text-muted-foreground text-xs tracking-wide uppercase">
              <th className="px-3 py-2 text-left font-medium">Nombre</th>
              <th className="px-3 py-2 text-left font-medium">Participantes</th>
              <th className="px-3 py-2 text-left font-medium">Creado</th>
              <th className="px-3 py-2 text-left font-medium">Estado</th>
              <th className="px-3 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id} className="border-border/60 border-t">
                <td className="px-3 py-3 align-middle font-medium">
                  <Link
                    to={`/groups/${group.id}/edit`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {group.name}
                  </Link>
                </td>
                <td className="px-3 py-3 align-middle">{group.participants.length}</td>
                <td className="text-muted-foreground px-3 py-3 align-middle">
                  {formatDate(group.createdAt)}
                </td>
                <td className="px-3 py-3 align-middle">
                  {group.archivedAt ? "Archivado" : "Activo"}
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex justify-end gap-2">
                    <GroupActions
                      group={group}
                      status={status}
                      onArchive={onArchive}
                      onRestore={onRestore}
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
