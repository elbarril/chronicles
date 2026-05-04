import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { type Encounter, type EncounterInput } from "@/domain/encounter";
import { EncounterForm } from "@/features/encounters/components/EncounterForm";
import { useEncounterActions } from "@/features/encounters/hooks/use-encounter-actions";
import { getEncounterDefinition } from "@/features/encounters/services/encounter-service";
import {
  getProjectDefinition,
  type ProjectWithParticipants,
} from "@/features/projects/services/project-service";

type LoadState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; encounter: Encounter; project: ProjectWithParticipants };

export function EncounterEditPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const encounterId = params.id ?? "";
  const actions = useEncounterActions();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (!encounterId) {
      return;
    }

    let isMounted = true;

    void (async () => {
      const encounter = await getEncounterDefinition(encounterId);

      if (!encounter) {
        if (isMounted) {
          setLoadState({ status: "missing" });
        }
        return;
      }

      const project = await getProjectDefinition(encounter.projectId);

      if (!isMounted) {
        return;
      }

      if (!project) {
        setLoadState({ status: "missing" });
        return;
      }

      setLoadState({ status: "ready", encounter, project });
    })();

    return () => {
      isMounted = false;
    };
  }, [encounterId]);

  const initialValues = useMemo<EncounterInput | null>(() => {
    if (loadState.status !== "ready") {
      return null;
    }

    const { encounter, project } = loadState;
    // Drop participantIds whose row no longer exists (e.g. removed from
    // the project after the encounter was created), so the form never
    // submits with unknown ids.
    const validIds = new Set(project.participants.map((participant) => participant.id));

    return {
      projectId: encounter.projectId,
      name: encounter.name,
      startsAt: encounter.startsAt,
      endsAt: encounter.endsAt,
      participantIds: encounter.participantIds.filter((id) => validIds.has(id)),
    };
  }, [loadState]);

  if (!encounterId) {
    return <p className="text-muted-foreground text-sm">Encuentro inválido.</p>;
  }

  if (loadState.status === "loading") {
    return <p className="text-muted-foreground text-sm">Cargando encuentro...</p>;
  }

  if (loadState.status === "missing") {
    return (
      <section className="space-y-3" aria-labelledby="encounter-edit-missing-title">
        <h1 id="encounter-edit-missing-title" className="text-3xl font-bold tracking-tight">
          Encuentro no encontrado
        </h1>
        <p className="text-muted-foreground text-sm">
          No pudimos encontrar este encuentro. Puede haber sido eliminado.
        </p>
        <Button type="button" variant="secondary" onClick={() => navigate("/projects")}>
          Volver a proyectos
        </Button>
      </section>
    );
  }

  const { encounter, project } = loadState;

  if (project.participants.length === 0) {
    return (
      <section className="space-y-3" aria-labelledby="encounter-edit-empty-title">
        <h1 id="encounter-edit-empty-title" className="text-3xl font-bold tracking-tight">
          Editar encuentro
        </h1>
        <p className="text-muted-foreground text-sm">
          Este proyecto no tiene participantes activos. Editalo para sumar al menos uno antes de
          editar el encuentro.
        </p>
        <Button asChild variant="secondary">
          <Link to={`/projects/${project.id}/edit`}>Editar proyecto</Link>
        </Button>
      </section>
    );
  }

  async function handleSubmit(values: EncounterInput): Promise<void> {
    await actions.update(encounter.id, values);
    navigate(`/encounters/${encounter.id}`);
  }

  return (
    <section className="space-y-6" aria-labelledby="encounter-edit-title">
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/" },
          { label: "Proyectos", to: "/projects" },
          { label: project.name, to: `/projects/${project.id}` },
          { label: encounter.name, to: `/encounters/${encounter.id}` },
          { label: "Editar" },
        ]}
      />

      <header>
        <h1 id="encounter-edit-title" className="text-3xl font-bold tracking-tight">
          Editar encuentro
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Ajustá el nombre, los horarios o los participantes que asistieron al encuentro.
        </p>
      </header>

      {initialValues ? (
        <EncounterForm
          initialValues={initialValues}
          participantsInProject={project.participants}
          isSaving={actions.isSaving}
          submitLabel="Guardar cambios"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/encounters/${encounter.id}`)}
        />
      ) : null}
    </section>
  );
}
