import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { encounterInputSchema, type EncounterInput } from "@/domain/encounter";
import { type Participant } from "@/domain/participant";
import { buildResolver } from "@/lib/zod";

interface EncounterFormProps {
  initialValues: EncounterInput;
  participantsInProject: Participant[];
  isSaving: boolean;
  submitLabel?: string;
  onSubmit: (values: EncounterInput) => Promise<void>;
  onCancel: () => void;
}

/** Converts an ISO datetime string into the local representation expected by
 *  the native `<input type="datetime-local">` (YYYY-MM-DDTHH:mm). */
function isoToLocalInputValue(isoValue: string): string {
  if (!isoValue) {
    return "";
  }

  const date = new Date(isoValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/** Converts the value of a `<input type="datetime-local">` (interpreted in
 *  local time) back into an ISO datetime string at the same instant. */
function localInputValueToIso(value: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

export function EncounterForm({
  initialValues,
  participantsInProject,
  isSaving,
  submitLabel,
  onSubmit,
  onCancel,
}: EncounterFormProps): JSX.Element {
  const form = useForm<EncounterInput>({
    resolver: buildResolver(encounterInputSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const sortedParticipants = useMemo(
    () =>
      [...participantsInProject].sort((left, right) =>
        left.displayName.localeCompare(right.displayName),
      ),
    [participantsInProject],
  );

  function toggleParticipant(currentIds: string[], participantId: string, checked: boolean): void {
    const nextIds = checked
      ? [...currentIds, participantId]
      : currentIds.filter((id) => id !== participantId);

    form.setValue("participantIds", nextIds, { shouldValidate: true });
  }

  async function handleSubmit(values: EncounterInput): Promise<void> {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-tour="encounters.new.name-input">
              <FormLabel>Nombre del encuentro</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Sesión del lunes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startsAt"
            render={({ field }) => (
              <FormItem data-tour="encounters.new.starts-at">
                <FormLabel>Inicio</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={isoToLocalInputValue(field.value)}
                    onChange={(event) => field.onChange(localInputValueToIso(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endsAt"
            render={({ field }) => (
              <FormItem data-tour="encounters.new.ends-at">
                <FormLabel>Cierre</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={isoToLocalInputValue(field.value)}
                    onChange={(event) => field.onChange(localInputValueToIso(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="participantIds"
          render={({ field }) => {
            const selectedIds = field.value ?? [];
            const errorMessage = form.formState.errors.participantIds?.message;

            return (
              <section
                className="space-y-3"
                aria-labelledby="encounter-participants-title"
                data-tour="encounters.new.participants"
              >
                <header>
                  <h2 id="encounter-participants-title" className="text-base font-semibold">
                    Participantes que estuvieron
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Seleccioná de la lista del proyecto quiénes estuvieron presentes en este
                    encuentro.
                  </p>
                </header>

                {sortedParticipants.length === 0 ? (
                  <p className="text-muted-foreground text-sm" role="status">
                    Este proyecto todavía no tiene participantes.
                  </p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {sortedParticipants.map((participant) => {
                      const checked = selectedIds.includes(participant.id);

                      return (
                        <li key={participant.id}>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) =>
                                toggleParticipant(selectedIds, participant.id, event.target.checked)
                              }
                            />
                            {participant.displayName}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {errorMessage ? <p className="text-destructive text-sm">{errorMessage}</p> : null}
              </section>
            );
          }}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving} data-tour="encounters.new.save-button">
            {isSaving ? "Guardando..." : (submitLabel ?? "Guardar encuentro")}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
