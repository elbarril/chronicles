import { Link, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import { FormListTable } from "@/features/forms/components/FormListTable";
import { useFormActions } from "@/features/forms/hooks/use-form-actions";
import { useObservationForms } from "@/features/forms/hooks/use-forms";

export function FormListPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") === "archived" ? "archived" : "active";
  const { forms, isLoading } = useObservationForms(status);
  const actions = useFormActions();

  return (
    <section className="space-y-6" aria-labelledby="form-list-title">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="form-list-title" className="text-3xl font-bold tracking-tight">
            Formularios
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Armá y versioná formularios de observación usando campos existentes.
          </p>
        </div>

        <Button asChild>
          <Link to="/forms/new">Nuevo formulario</Link>
        </Button>
      </header>

      <div className="flex gap-2" role="tablist" aria-label="Filtros de estado de formularios">
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
        <p className="text-muted-foreground text-sm">Cargando formularios...</p>
      ) : (
        <FormListTable
          forms={forms}
          status={status}
          onArchive={actions.archive}
          onRestore={actions.restore}
        />
      )}
    </section>
  );
}
