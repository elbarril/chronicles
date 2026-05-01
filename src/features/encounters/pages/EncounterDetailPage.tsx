import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Observation } from "@/domain/observation";
import { useChronicleActions } from "@/features/chronicles/hooks/use-chronicle-actions";
import { getChronicleForEncounter } from "@/features/chronicles/services/chronicle-service";
import { EncounterHeader } from "@/features/encounters/components/EncounterHeader";
import { EncounterTimeline } from "@/features/encounters/components/EncounterTimeline";
import { useEncounter } from "@/features/encounters/hooks/use-encounter";
import { useEncounterActions } from "@/features/encounters/hooks/use-encounter-actions";
import { useExportEncounter } from "@/features/encounters/hooks/use-export-encounter";
import { encounterMessages } from "@/features/encounters/lib/messages";
import { ObservationForm } from "@/features/observations/components/ObservationForm";
import { useObservationActions } from "@/features/observations/hooks/use-observation-actions";

export function EncounterDetailPage(): JSX.Element {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const encounterId = params.id ?? "";
  const isObservationNewRoute = location.pathname.endsWith("/observations/new");

  const { encounter, fields, participants, observations, isLoading } = useEncounter(encounterId);
  const encounterActions = useEncounterActions();
  const encounterExport = useExportEncounter();
  const chronicleActions = useChronicleActions();
  const observationActions = useObservationActions(fields);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingObservation, setEditingObservation] = useState<Observation | undefined>();

  const participantById = useMemo(
    () => new Map(participants.map((participant) => [participant.id, participant.displayName])),
    [participants],
  );

  async function handleFinishEncounter(): Promise<void> {
    if (!encounter) {
      return;
    }

    await encounterActions.finish(encounter.id);
  }

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

  async function handleSubmitObservation(values: {
    participantId?: string;
    title?: string;
    values: Record<string, unknown>;
  }): Promise<void> {
    if (!encounter) {
      return;
    }

    if (editingObservation) {
      await observationActions.update(editingObservation.id, values);
    } else {
      await observationActions.create({
        encounterId: encounter.id,
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

  async function handleExportEncounter(): Promise<void> {
    if (!encounter) {
      return;
    }

    await encounterExport.exportEncounter(encounter.id);
  }

  async function handleGenerateChronicle(): Promise<void> {
    if (!encounter) {
      return;
    }

    const existingChronicle = await getChronicleForEncounter(encounter.id);

    if (existingChronicle) {
      navigate(`/chronicles/${existingChronicle.id}`);
      return;
    }

    const chronicle = await chronicleActions.generate(encounter.id);
    navigate(`/chronicles/${chronicle.id}`);
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
        <Button type="button" variant="secondary" onClick={() => navigate("/encounters")}>
          Volver a encuentros
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="encounter-detail-title">
      <nav aria-label="Migas de pan">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/encounters">← Volver a encuentros</Link>
        </Button>
      </nav>

      <EncounterHeader
        encounter={encounter}
        participantCount={participants.length}
        onFinish={handleFinishEncounter}
        onExport={handleExportEncounter}
        onGenerateChronicle={handleGenerateChronicle}
        onArchive={handleArchiveEncounter}
        onRestore={handleRestoreEncounter}
        isExporting={encounterExport.isExporting}
        isGeneratingChronicle={chronicleActions.isGenerating}
        exportLabel={encounterMessages.exportButton}
        generateChronicleLabel={encounterMessages.generateChronicleButton}
        generatingChronicleLabel={encounterMessages.generatingChronicleButton}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="encounter-detail-title" className="text-xl font-semibold">
          Timeline de observaciones
        </h2>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={() => {
            setEditingObservation(undefined);
            setIsDialogOpen(true);
          }}
        >
          Nueva observación
        </Button>
      </div>

      <EncounterTimeline
        observations={observations}
        fields={fields}
        participantById={participantById}
        onEdit={(observation) => {
          setEditingObservation(observation);
          setIsDialogOpen(true);
        }}
        onDelete={observationActions.remove}
      />

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
              Registrá una observación asociada al encuentro en curso.
            </DialogDescription>
          </DialogHeader>

          <ObservationForm
            fields={fields}
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
    </section>
  );
}
