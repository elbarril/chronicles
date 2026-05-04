import { Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Field, type FieldFormInput } from "@/domain/field";
import { FieldForm } from "@/features/field-definitions/components/FieldForm";
import { FieldListTable } from "@/features/field-definitions/components/FieldListTable";
import { useFieldActions } from "@/features/field-definitions/hooks/use-field-actions";
import { useFields } from "@/features/field-definitions/hooks/use-fields";
import { getDefaultFieldInput } from "@/features/field-definitions/lib/field-defaults";
import { fieldTypeLabel } from "@/features/field-definitions/lib/field-type-meta";

type ViewState = { mode: "list" } | { mode: "create" } | { mode: "edit"; field: Field };

export function ManageFieldsDialog(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewState>({ mode: "list" });
  const { fields: activeFields } = useFields("active");
  const { fields: archivedFields } = useFields("archived");
  const [tab, setTab] = useState<"active" | "archived">("active");
  const actions = useFieldActions();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setView({ mode: "list" });
      setTab("active");
    }
  }

  async function handleCreate(values: FieldFormInput) {
    await actions.create(values);
    setView({ mode: "list" });
  }

  async function handleUpdate(field: Field, values: FieldFormInput) {
    await actions.update(field.id, values);
    setView({ mode: "list" });
  }

  function renderView() {
    if (view.mode === "create") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setView({ mode: "list" })}
            >
              ← Volver
            </Button>
            <h2 className="text-base font-semibold">Nuevo campo</h2>
          </div>
          <FieldForm
            initialValues={getDefaultFieldInput("text")}
            isSaving={actions.isSaving}
            onSubmit={handleCreate}
            onCancel={() => setView({ mode: "list" })}
          />
        </div>
      );
    }

    if (view.mode === "edit") {
      const { field } = view;
      const initialValues: FieldFormInput = {
        type: field.type,
        key: field.key,
        label: field.label,
        required: field.required,
        helpText: field.helpText,
        config: field.config,
      } as FieldFormInput;

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setView({ mode: "list" })}
            >
              ← Volver
            </Button>
            <h2 className="text-base font-semibold">
              Editar campo: <span className="font-normal">{field.label}</span>{" "}
              <span className="text-muted-foreground text-xs">({fieldTypeLabel[field.type]})</span>
            </h2>
          </div>
          <FieldForm
            initialValues={initialValues}
            isSaving={actions.isSaving}
            onSubmit={(values) => handleUpdate(field, values)}
            onCancel={() => setView({ mode: "list" })}
          />
        </div>
      );
    }

    // list mode
    const fields = tab === "active" ? activeFields : archivedFields;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex gap-1 rounded-md border p-1"
            role="tablist"
            aria-label="Filtrar campos"
          >
            <button
              role="tab"
              aria-selected={tab === "active"}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                tab === "active"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setTab("active")}
            >
              Activos
            </button>
            <button
              role="tab"
              aria-selected={tab === "archived"}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                tab === "archived"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setTab("archived")}
            >
              Archivados
            </button>
          </div>
          <Button type="button" size="sm" onClick={() => setView({ mode: "create" })}>
            + Nuevo campo
          </Button>
        </div>
        <FieldListTable
          fields={fields ?? []}
          status={tab}
          onArchive={actions.archive}
          onRestore={actions.restore}
          onEdit={(field) => setView({ mode: "edit", field })}
        />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" data-tour="forms.builder.manage-fields">
          <Settings className="mr-1 h-4 w-4" aria-hidden="true" />
          Editar campos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Campos</DialogTitle>
        </DialogHeader>
        {renderView()}
      </DialogContent>
    </Dialog>
  );
}
