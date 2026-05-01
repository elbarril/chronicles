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

function FieldActions({
  field,
  status,
  onArchive,
  onRestore,
}: {
  field: Field;
  status: "active" | "archived";
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
}): JSX.Element {
  if (status === "active") {
    return (
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
    );
  }

  return (
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
  );
}

export function FieldListTable({
  fields,
  status,
  onArchive,
  onRestore,
}: FieldListTableProps): JSX.Element {
  if (fields.length === 0) {
    return (
      <div className="bg-muted/40 rounded-3xl p-6 text-center">
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
    <>
      {/* Mobile / tablet: cards */}
      <ul className="grid gap-3 lg:hidden" aria-label="Listado de campos">
        {fields.map((field) => (
          <li key={field.id} className="bg-muted/40 space-y-3 rounded-2xl p-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">
                <Link
                  to={`/fields/${field.id}/edit`}
                  className="hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {field.label}
                </Link>
              </p>
              <p className="text-muted-foreground text-xs">
                {field.archivedAt ? "Archivado" : "Activo"} · {formatDate(field.createdAt)}
              </p>
              {field.helpText ? (
                <p className="text-muted-foreground text-xs">{field.helpText}</p>
              ) : null}
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Clave:</dt>
                <dd className="truncate font-mono text-xs">{field.key}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Tipo:</dt>
                <dd>{fieldTypeLabel[field.type]}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Obligatorio:</dt>
                <dd>{field.required ? "Sí" : "No"}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 pt-1">
              <FieldActions
                field={field}
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
          <caption className="sr-only">Listado de campos</caption>
          <thead>
            <tr className="text-muted-foreground text-xs tracking-wide uppercase">
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
              <tr key={field.id} className="border-border/60 border-t">
                <td className="px-3 py-3 align-top">
                  <div className="font-medium">
                    <Link
                      to={`/fields/${field.id}/edit`}
                      className="hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {field.label}
                    </Link>
                  </div>
                  {field.helpText ? (
                    <p className="text-muted-foreground mt-1 text-xs">{field.helpText}</p>
                  ) : null}
                </td>
                <td className="text-muted-foreground px-3 py-3 align-top font-mono text-xs">
                  {field.key}
                </td>
                <td className="px-3 py-3 align-top">{fieldTypeLabel[field.type]}</td>
                <td className="px-3 py-3 align-top">{field.required ? "Sí" : "No"}</td>
                <td className="text-muted-foreground px-3 py-3 align-top">
                  {formatDate(field.createdAt)}
                </td>
                <td className="px-3 py-3 align-top">{field.archivedAt ? "Archivado" : "Activo"}</td>
                <td className="px-3 py-3 align-top">
                  <div className="flex justify-end gap-2">
                    <FieldActions
                      field={field}
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
