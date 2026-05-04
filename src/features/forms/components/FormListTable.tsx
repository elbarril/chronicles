import { useState } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { type ObservationForm } from "@/domain/form";
import { formMessages } from "@/features/forms/lib/messages";

interface FormListTableProps {
  forms: ObservationForm[];
  status: "active" | "archived";
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function FormActions({
  form,
  status,
  onArchive,
  onRestore,
  onRequestDelete,
}: {
  form: ObservationForm;
  status: "active" | "archived";
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onRequestDelete: (id: string) => void;
}): JSX.Element {
  if (status === "active") {
    return (
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
    );
  }

  return (
    <>
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
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => {
          onRequestDelete(form.id);
        }}
      >
        Eliminar
      </Button>
    </>
  );
}

export function FormListTable({
  forms,
  status,
  onArchive,
  onRestore,
  onDelete,
}: FormListTableProps): JSX.Element {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete(): Promise<void> {
    if (!pendingDeleteId) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(pendingDeleteId);
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  }

  if (forms.length === 0) {
    return (
      <div className="bg-muted/40 rounded-3xl p-6 text-center">
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
    <>
      {/* Mobile / tablet: cards */}
      <ul className="grid gap-3 lg:hidden" aria-label="Listado de formularios">
        {forms.map((form) => (
          <li key={form.id} className="bg-muted/40 space-y-3 rounded-2xl p-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">
                <Link
                  to={`/forms/${form.id}/edit`}
                  className="hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {form.name}
                </Link>
              </p>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Campos:</dt>
                <dd>{form.fields.length}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 pt-1">
              <FormActions
                form={form}
                status={status}
                onArchive={onArchive}
                onRestore={onRestore}
                onRequestDelete={setPendingDeleteId}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Listado de formularios</caption>
          <thead>
            <tr className="text-muted-foreground text-xs tracking-wide uppercase">
              <th className="px-3 py-2 text-left font-medium">Nombre</th>
              <th className="px-3 py-2 text-left font-medium">Campos</th>
              <th className="px-3 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id} className="border-border/60 border-t">
                <td className="px-3 py-3 align-middle font-medium">
                  <Link
                    to={`/forms/${form.id}/edit`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {form.name}
                  </Link>
                </td>
                <td className="px-3 py-3 align-middle">{form.fields.length}</td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex justify-end gap-2">
                    <FormActions
                      form={form}
                      status={status}
                      onArchive={onArchive}
                      onRestore={onRestore}
                      onRequestDelete={setPendingDeleteId}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteDialog
        open={pendingDeleteId !== null}
        title={formMessages.confirmDeleteTitle}
        description={formMessages.confirmDeleteDescription}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isLoading={isDeleting}
      />
    </>
  );
}
