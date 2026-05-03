import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { type EncounterInput } from "@/domain/encounter";
import { EncounterForm } from "@/features/encounters/components/EncounterForm";
import { useEncounterActions } from "@/features/encounters/hooks/use-encounter-actions";
import { getDefaultEncounterInput } from "@/features/encounters/lib/encounter-defaults";
import {
  getProjectDefinition,
  type ProjectWithParticipants,
} from "@/features/projects/services/project-service";

export function EncounterNewPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId ?? "";
  const actions = useEncounterActions();
  const [project, setProject] = useState<ProjectWithParticipants | null | undefined>(undefined);

  const initialValues = useMemo<EncounterInput>(
    () => getDefaultEncounterInput(projectId),
    [projectId],
  );

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let isMounted = true;

    void getProjectDefinition(projectId).then((result) => {
      if (!isMounted) {
        return;
      }

      setProject(result ?? null);
    });

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (!projectId) {
    return <p className="text-muted-foreground text-sm">Proyecto inválido.</p>;
  }

  if (project === undefined) {
    return <p className="text-muted-foreground text-sm">Cargando proyecto...</p>;
  }

  if (!project) {
    return (
      <section className="space-y-3" aria-labelledby="encounter-new-missing-title">
        <h1 id="encounter-new-missing-title" className="text-3xl font-bold tracking-tight">
          Proyecto no encontrado
        </h1>
        <Button type="button" variant="secondary" onClick={() => navigate("/projects")}>
          Volver a proyectos
        </Button>
      </section>
    );
  }

  if (project.participants.length === 0) {
    return (
      <section className="space-y-3" aria-labelledby="encounter-new-empty-title">
        <h1 id="encounter-new-empty-title" className="text-3xl font-bold tracking-tight">
          Nuevo encuentro
        </h1>
        <p className="text-muted-foreground text-sm">
          Este proyecto todavía no tiene participantes. Editalo para sumar al menos uno antes de
          crear un encuentro.
        </p>
        <Button asChild variant="secondary">
          <Link to={`/projects/${project.id}/edit`}>Editar proyecto</Link>
        </Button>
      </section>
    );
  }

  async function handleSubmit(values: EncounterInput): Promise<void> {
    const encounter = await actions.create(values);
    navigate(`/encounters/${encounter.id}`);
  }

  return (
    <section className="space-y-6" aria-labelledby="encounter-new-title">
      <nav aria-label="Migas de pan">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={`/projects/${project.id}`}>← Volver al proyecto</Link>
        </Button>
      </nav>

      <header>
        <h1 id="encounter-new-title" className="text-3xl font-bold tracking-tight">
          Nuevo encuentro
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Registrá lo que ya pasó: nombre del encuentro, fecha y hora de inicio y cierre, y quiénes
          participaron.
        </p>
      </header>

      <EncounterForm
        initialValues={initialValues}
        participantsInProject={project.participants}
        isSaving={actions.isSaving}
        submitLabel="Crear encuentro"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/projects/${project.id}`)}
      />
    </section>
  );
}
