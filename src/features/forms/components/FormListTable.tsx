import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { type ObservationForm } from "@/domain/form";

interface FormListTableProps {
  forms: ObservationForm[];
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

export function FormListTable({
  forms,
  status,
  onArchive,
  onRestore,
}: FormListTableProps): JSX.Element {
  if (forms.length === 0) {
    return (
      <div className="border-border bg-card rounded-md border p-6 text-center">
        <p className="text-muted-foreground mb-4">
          {status === "active"
            ? "Todavía no hay formularios activos."
            : "No hay formularios archivados para mostrar."}
        </p>
        {status === "active" ? (
          <Button asChild>
            <Link to="/forms/new">Crear primer formulario</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <table className="w-full min-w-[700px] border-collapse text-sm">
        <caption className="sr-only">Listado de formularios</caption>
        <thead className="bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Nombre</th>
            <th className="px-3 py-2 text-left font-medium">Campos</th>
            <th className="px-3 py-2 text-left font-medium">Versión</th>
            <th className="px-3 py-2 text-left font-medium">Creado</th>
            <th className="px-3 py-2 text-left font-medium">Estado</th>
            <th className="px-3 py-2 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id} className="border-border border-t">
              <td className="px-3 py-2 align-top font-medium">{form.name}</td>
              <td className="px-3 py-2 align-top">{form.fieldIds.length}</td>
              <td className="px-3 py-2 align-top">{form.version}</td>
              <td className="px-3 py-2 align-top">{formatDate(form.createdAt)}</td>
              <td className="px-3 py-2 align-top">{form.archivedAt ? "Archivado" : "Activo"}</td>
              <td className="px-3 py-2 align-top">
                <div className="flex justify-end gap-2">
                  {status === "active" ? (
                    <>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/forms/${form.id}/edit`}>Editar</Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          void onArchive(form.id);
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
                        void onRestore(form.id);
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
