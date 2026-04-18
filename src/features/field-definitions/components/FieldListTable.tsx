import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { type Field } from "@/domain/field";
import { fieldTypeLabel } from "@/features/field-definitions/lib/field-type-meta";

interface FieldListTableProps {
  fields: Field[];
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

export function FieldListTable({
  fields,
  status,
  onArchive,
  onRestore,
}: FieldListTableProps): JSX.Element {
  if (fields.length === 0) {
    return (
      <div className="border-border bg-card rounded-md border p-6 text-center">
        <p className="text-muted-foreground mb-4">
          {status === "active"
            ? "Todavía no hay campos activos."
            : "No hay campos archivados para mostrar."}
        </p>
        {status === "active" ? (
          <Button asChild>
            <Link to="/fields/new">Crear primer campo</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <table className="w-full min-w-[700px] border-collapse text-sm">
        <caption className="sr-only">Listado de campos</caption>
        <thead className="bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Nombre</th>
            <th className="px-3 py-2 text-left font-medium">Clave</th>
            <th className="px-3 py-2 text-left font-medium">Tipo</th>
            <th className="px-3 py-2 text-left font-medium">Obligatorio</th>
            <th className="px-3 py-2 text-left font-medium">Creado</th>
            <th className="px-3 py-2 text-left font-medium">Estado</th>
            <th className="px-3 py-2 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id} className="border-border border-t">
              <td className="px-3 py-2 align-top">
                <div className="font-medium">{field.label}</div>
                {field.helpText ? (
                  <p className="text-muted-foreground mt-1 text-xs">{field.helpText}</p>
                ) : null}
              </td>
              <td className="text-muted-foreground px-3 py-2 align-top">{field.key}</td>
              <td className="px-3 py-2 align-top">{fieldTypeLabel[field.type]}</td>
              <td className="px-3 py-2 align-top">{field.required ? "Sí" : "No"}</td>
              <td className="px-3 py-2 align-top">{formatDate(field.createdAt)}</td>
              <td className="px-3 py-2 align-top">{field.archivedAt ? "Archivado" : "Activo"}</td>
              <td className="px-3 py-2 align-top">
                <div className="flex justify-end gap-2">
                  {status === "active" ? (
                    <>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/fields/${field.id}/edit`}>Editar</Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          void onArchive(field.id);
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
                        void onRestore(field.id);
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
