import { Link, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { FieldListTable } from "@/features/field-definitions/components/FieldListTable";
import { useFieldActions } from "@/features/field-definitions/hooks/use-field-actions";
import { useFields } from "@/features/field-definitions/hooks/use-fields";

export function FieldListPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") === "archived" ? "archived" : "active";
  const { fields, isLoading } = useFields(status);
  const actions = useFieldActions();

  return (
    <section className="space-y-6" aria-labelledby="field-list-title">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="field-list-title" className="text-3xl font-bold tracking-tight">
            Campos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Definí, editá y archivá los campos del formulario de observación.
          </p>
        </div>

        <Button asChild>
          <Link to="/fields/new">Nuevo campo</Link>
        </Button>
      </header>

      <div className="flex gap-2" role="tablist" aria-label="Filtros de estado de campos">
        <Button
          type="button"
          variant={status === "active" ? "default" : "outline"}
          onClick={() => setSearchParams({ status: "active" })}
        >
          Activos
        </Button>
        <Button
          type="button"
          variant={status === "archived" ? "default" : "outline"}
          onClick={() => setSearchParams({ status: "archived" })}
        >
          Archivados
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando campos...</p>
      ) : (
        <FieldListTable
          fields={fields}
          status={status}
          onArchive={actions.archive}
          onRestore={actions.restore}
        />
      )}
    </section>
  );
}
