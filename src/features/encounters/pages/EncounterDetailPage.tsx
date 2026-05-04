import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Observation } from "@/domain/observation";
import { EncounterHeader } from "@/features/encounters/components/EncounterHeader";
import { EncounterTimeline } from "@/features/encounters/components/EncounterTimeline";
import { useEncounter } from "@/features/encounters/hooks/use-encounter";
import { useEncounterActions } from "@/features/encounters/hooks/use-encounter-actions";
import { encounterMessages } from "@/features/encounters/lib/messages";
import { ObservationForm } from "@/features/observations/components/ObservationForm";
import { useObservationActions } from "@/features/observations/hooks/use-observation-actions";
import { observationMessages } from "@/features/observations/lib/messages";

export function EncounterDetailPage(): JSX.Element {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const encounterId = params.id ?? "";
  const isObservationNewRoute = location.pathname.endsWith("/observations/new");

  const { encounter, project, fields, participants, observations, isLoading } =
    useEncounter(encounterId);
  const encounterActions = useEncounterActions();
  const observationActions = useObservationActions();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingObservation, setEditingObservation] = useState<Observation | undefined>();

  // Encounter delete confirm
  const [showDeleteEncounterConfirm, setShowDeleteEncounterConfirm] = useState(false);
  const [isDeletingEncounter, setIsDeletingEncounter] = useState(false);

  // Observation delete confirm
  const [pendingDeleteObservationId, setPendingDeleteObservationId] = useState<string | null>(null);
  const [isDeletingObservation, setIsDeletingObservation] = useState(false);

  const participantById = useMemo(
    () => new Map(participants.map((participant) => [participant.id, participant.displayName])),
    [participants],
  );

  const fieldsById = useMemo(() => new Map(fields.map((field) => [field.id, field])), [fields]);

  async function handleArchiveEncounter(): Promise<void> {
    if (!encounter) {
      return;
    }

    await encounterActions.archive(encounter.id);
  }

  async function handleRestoreEncounter(): Promise<void> {
    if (!encounter) {
      return;
    }

    await encounterActions.restore(encounter.id);
  }

  async function handleDeleteEncounter(): Promise<void> {
    if (!encounter) {
      return;
    }

    setIsDeletingEncounter(true);

    try {
      await encounterActions.remove(encounter.id);
      const projectId = project?.id;
      navigate(projectId ? `/projects/${projectId}` : "/projects");
    } finally {
      setIsDeletingEncounter(false);
      setShowDeleteEncounterConfirm(false);
    }
  }

  async function handleConfirmDeleteObservation(): Promise<void> {
    if (!pendingDeleteObservationId) {
      return;
    }

    setIsDeletingObservation(true);

    try {
      await observationActions.remove(pendingDeleteObservationId);
    } finally {
      setIsDeletingObservation(false);
      setPendingDeleteObservationId(null);
    }
  }

  async function handleSubmitObservation(values: {
    formId: string;
    participantId?: string;
    title?: string;
    values: Record<string, unknown>;
  }): Promise<void> {
    if (!encounter) {
      return;
    }

    if (editingObservation) {
      await observationActions.update(editingObservation.id, {
        formId: editingObservation.formId,
        participantId: values.participantId,
        title: values.title,
        values: values.values,
      });
    } else {
      await observationActions.create({
        encounterId: encounter.id,
        formId: values.formId,
        participantId: values.participantId,
        title: values.title,
        values: values.values,
      });
    }

    setEditingObservation(undefined);
    setIsDialogOpen(false);

    if (isObservationNewRoute) {
      navigate(`/encounters/${encounter.id}`, { replace: true });
    }
  }

  if (!params.id) {
    return <p className="text-muted-foreground text-sm">Encuentro inválido.</p>;
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Cargando encuentro...</p>;
  }

  if (!encounter) {
    return (
      <section className="space-y-3" aria-labelledby="encounter-missing-title">
        <h1 id="encounter-missing-title" className="text-3xl font-bold tracking-tight">
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

  const projectName = project?.name ?? "Proyecto";

  const breadcrumbs = [
    { label: "Inicio", to: "/" },
    { label: "Proyectos", to: "/projects" },
    project ? { label: projectName, to: `/projects/${project.id}` } : { label: projectName },
    { label: encounter.name },
  ];

  return (
    <section className="space-y-6" aria-labelledby="encounter-detail-title">
      <Breadcrumbs items={breadcrumbs} />

      <EncounterHeader
        encounter={encounter}
        projectName={projectName}
        participantCount={participants.length}
        observationCount={observations.length}
        onArchive={handleArchiveEncounter}
        onRestore={handleRestoreEncounter}
        onRequestDelete={() => setShowDeleteEncounterConfirm(true)}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="encounter-detail-title" className="text-xl font-semibold">
          Observaciones del encuentro
        </h2>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingObservation(undefined);
            setIsDialogOpen(true);
          }}
          data-tour="encounter.detail.new-observation"
        >
          Nueva observación
        </Button>
      </div>

      <div data-tour="encounter.detail.observations-list">
        <EncounterTimeline
          observations={observations}
          fieldsById={fieldsById}
          participantById={participantById}
          onEdit={(observation) => {
            setEditingObservation(observation);
            setIsDialogOpen(true);
          }}
          onRequestDelete={setPendingDeleteObservationId}
        />
      </div>

      <Dialog
        open={isObservationNewRoute || isDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && isObservationNewRoute && encounter) {
            navigate(`/encounters/${encounter.id}`, { replace: true });
            return;
          }

          setIsDialogOpen(nextOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingObservation ? "Editar observación" : "Nueva observación"}
            </DialogTitle>
            <DialogDescription>
              Elegí el formulario y registrá lo que viste durante el encuentro.
            </DialogDescription>
          </DialogHeader>

          <div data-tour="encounter.detail.observation-form">
            <ObservationForm
              participants={participants.map((participant) => ({
                id: participant.id,
                displayName: participant.displayName,
              }))}
              initialObservation={editingObservation}
              isSaving={observationActions.isSaving}
              onSubmit={handleSubmitObservation}
              onCancel={() => {
                setEditingObservation(undefined);
                setIsDialogOpen(false);
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingObservation(undefined);
                setIsDialogOpen(false);
              }}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={showDeleteEncounterConfirm}
        title={encounterMessages.confirmDeleteTitle}
        description={encounterMessages.confirmDeleteDescription}
        onConfirm={handleDeleteEncounter}
        onCancel={() => setShowDeleteEncounterConfirm(false)}
        isLoading={isDeletingEncounter}
      />

      <ConfirmDeleteDialog
        open={pendingDeleteObservationId !== null}
        title={observationMessages.confirmDeleteTitle}
        description={observationMessages.confirmDeleteDescription}
        onConfirm={handleConfirmDeleteObservation}
        onCancel={() => setPendingDeleteObservationId(null)}
        isLoading={isDeletingObservation}
      />
    </section>
  );
}
