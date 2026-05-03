import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { type ProjectInput } from "@/domain/project";
import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { useProjectActions } from "@/features/projects/hooks/use-project-actions";
import { getDefaultProjectInput } from "@/features/projects/lib/project-defaults";
import { getProjectDefinition } from "@/features/projects/services/project-service";

function toFormInput(project: Awaited<ReturnType<typeof getProjectDefinition>>): ProjectInput {
  if (!project) {
    return getDefaultProjectInput();
  }

  return {
    name: project.name,
    participantNames: project.participants.map((participant) => participant.displayName),
  };
}

export function ProjectFormPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.id;
  const mode = projectId ? "edit" : "create";
  const actions = useProjectActions();
  const createInitialValues = useMemo(() => getDefaultProjectInput(), []);

  const [editInitialValues, setEditInitialValues] = useState<ProjectInput | null>(
    mode === "edit" ? null : createInitialValues,
  );

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let isMounted = true;

    void getProjectDefinition(projectId).then((project) => {
      if (!isMounted) {
        return;
      }

      if (!project) {
        navigate("/projects", { replace: true });
        return;
      }

      setEditInitialValues(toFormInput(project));
    });

    return () => {
      isMounted = false;
    };
  }, [projectId, navigate]);

  const title = useMemo(() => (mode === "create" ? "Nuevo proyecto" : "Editar proyecto"), [mode]);

  async function handleSubmit(values: ProjectInput): Promise<void> {
    if (mode === "create") {
      const project = await actions.create(values);
      navigate(`/projects/${project.id}`);
      return;
    }

    if (!projectId) {
      return;
    }

    await actions.update(projectId, values);
    navigate(`/projects/${projectId}`);
  }

  if (mode === "edit" && !editInitialValues) {
    return <p className="text-muted-foreground text-sm">Cargando proyecto...</p>;
  }

  const initialValues = editInitialValues ?? createInitialValues;

  const cancelTarget = mode === "edit" && projectId ? `/projects/${projectId}` : "/projects";

  return (
    <section className="space-y-6" aria-labelledby="project-form-title">
      <nav aria-label="Migas de pan">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={cancelTarget}>← Volver</Link>
        </Button>
      </nav>

      <header>
        <h1 id="project-form-title" className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Definí el proyecto y la lista de participantes que lo integran. Después vas a poder crear
          encuentros para registrar lo que ocurrió.
        </p>
      </header>

      <ProjectForm
        initialValues={initialValues}
        isSaving={actions.isSaving}
        onSubmit={handleSubmit}
        onCancel={() => navigate(cancelTarget)}
      />
    </section>
  );
}
