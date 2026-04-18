import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

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
import { EncounterHeader } from "@/features/encounters/components/EncounterHeader";
import { EncounterTimeline } from "@/features/encounters/components/EncounterTimeline";
import { useEncounter } from "@/features/encounters/hooks/use-encounter";
import { useEncounterActions } from "@/features/encounters/hooks/use-encounter-actions";
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

  async function handleSubmitObservation(values: {
    participantId?: string;
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
        <Button type="button" variant="secondary" onClick={() => navigate("/encounters")}>
          Volver a encuentros
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="encounter-detail-title">
      <EncounterHeader
        encounter={encounter}
        participantCount={participants.length}
        onFinish={handleFinishEncounter}
      />

      <div className="flex items-center justify-between gap-2">
        <h2 id="encounter-detail-title" className="text-xl font-semibold">
          Timeline de observaciones
        </h2>
        <Button
          type="button"
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
