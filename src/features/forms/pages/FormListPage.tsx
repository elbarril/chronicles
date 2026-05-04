import { Link, useSearchParams } from "react-router";

import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DemoEncounterButton } from "@/features/defaults/components/DemoEncounterButton";
import { useDefaultsActions } from "@/features/defaults/hooks/use-defaults-actions";
import { defaultsMessages } from "@/features/defaults/lib/messages";
import { FormListTable } from "@/features/forms/components/FormListTable";
import { useFormActions } from "@/features/forms/hooks/use-form-actions";
import { useObservationForms } from "@/features/forms/hooks/use-forms";

export function FormListPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") === "archived" ? "archived" : "active";
  const { forms, isLoading } = useObservationForms(status);
  const actions = useFormActions();
  const defaults = useDefaultsActions();

  return (
    <section className="space-y-6" aria-labelledby="form-list-title">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Formularios" }]} />

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="form-list-title" className="text-3xl font-bold tracking-tight">
            Formularios
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Armá formularios de observación combinando campos existentes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DemoEncounterButton removeOnly />
          <Button
            type="button"
            variant="outline"
            disabled={defaults.isLoading}
            onClick={() => {
              void defaults.restoreForm();
            }}
          >
            {defaultsMessages.loadDefaultForm}
          </Button>
          <Button asChild data-tour="forms.new-button">
            <Link to="/forms/new">Nuevo formulario</Link>
          </Button>
        </div>
      </header>

      <div
        className="flex gap-2"
        role="tablist"
        aria-label="Filtros de estado de formularios"
        data-tour="forms.list-region"
      >
        <Button
          type="button"
          variant={status === "active" ? "tab-active" : "outline"}
          onClick={() => setSearchParams({ status: "active" })}
        >
          Activos
        </Button>
        <Button
          type="button"
          variant={status === "archived" ? "tab-active" : "outline"}
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
          onDelete={actions.remove}
        />
      )}
    </section>
  );
}
