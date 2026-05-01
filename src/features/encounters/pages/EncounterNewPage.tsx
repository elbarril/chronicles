import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { EncounterForm } from "@/features/encounters/components/EncounterForm";
import { useEncounterActions } from "@/features/encounters/hooks/use-encounter-actions";
import { getDefaultEncounterInput } from "@/features/encounters/lib/encounter-defaults";
import { listEncounterCreateDependencies } from "@/features/encounters/services/encounter-service";

export function EncounterNewPage(): JSX.Element {
  const navigate = useNavigate();
  const actions = useEncounterActions();
  const defaultValues = useMemo(() => getDefaultEncounterInput(), []);

  const [isLoadingDependencies, setIsLoadingDependencies] = useState(true);
  const [dependencies, setDependencies] = useState<
    Awaited<ReturnType<typeof listEncounterCreateDependencies>>
  >({
    groups: [],
    forms: [],
  });

  useEffect(() => {
    let isMounted = true;

    void listEncounterCreateDependencies().then((result) => {
      if (!isMounted) {
        return;
      }

      setDependencies(result);
      setIsLoadingDependencies(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(values: Parameters<typeof actions.create>[0]) {
    const encounter = await actions.create(values);
    navigate(`/encounters/${encounter.id}`);
  }

  if (isLoadingDependencies) {
    return <p className="text-muted-foreground text-sm">Cargando datos para crear encuentro...</p>;
  }

  if (dependencies.groups.length === 0 || dependencies.forms.length === 0) {
    return (
      <section className="space-y-3" aria-labelledby="encounter-new-title">
        <h1 id="encounter-new-title" className="text-3xl font-bold tracking-tight">
          Nuevo encuentro
        </h1>
        <p className="text-muted-foreground text-sm">
          Necesitás al menos un grupo y un formulario activo para iniciar un encuentro.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="encounter-new-title">
      <nav aria-label="Migas de pan">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/encounters">← Volver a encuentros</Link>
        </Button>
      </nav>

      <header>
        <h1 id="encounter-new-title" className="text-3xl font-bold tracking-tight">
          Nuevo encuentro
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Elegí grupo, formulario y actividad para empezar la captura de observaciones.
        </p>
      </header>

      <EncounterForm
        initialValues={defaultValues}
        groups={dependencies.groups.map((group) => ({
          id: group.id,
          name: group.name,
        }))}
        forms={dependencies.forms.map((form) => ({
          id: form.id,
          name: form.name,
          version: form.version,
        }))}
        isSaving={actions.isSaving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/encounters")}
      />
    </section>
  );
}
