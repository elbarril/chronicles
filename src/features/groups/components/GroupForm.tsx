import { useEffect } from "react";
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
import { groupInputSchema, type GroupInput } from "@/domain/group";
import { buildResolver } from "@/lib/zod";

interface GroupFormProps {
  initialValues: GroupInput;
  isSaving: boolean;
  onSubmit: (values: GroupInput) => Promise<void>;
  onCancel: () => void;
}

export function GroupForm({
  initialValues,
  isSaving,
  onSubmit,
  onCancel,
}: GroupFormProps): JSX.Element {
  const form = useForm<GroupInput>({
    resolver: buildResolver(groupInputSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  function addParticipant(currentParticipants: string[]): void {
    form.setValue("participantNames", [...currentParticipants, ""], { shouldValidate: true });
  }

  function removeParticipant(currentParticipants: string[], index: number): void {
    form.setValue(
      "participantNames",
      currentParticipants.filter((_, currentIndex) => currentIndex !== index),
      { shouldValidate: true },
    );
  }

  function updateParticipantName(
    currentParticipants: string[],
    index: number,
    value: string,
  ): void {
    const next = [...currentParticipants];
    next[index] = value;
    form.setValue("participantNames", next, { shouldValidate: true });
  }

  async function handleSubmit(values: GroupInput): Promise<void> {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del grupo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Sala Azul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participantNames"
          render={({ field }) => {
            const participantNames = field.value ?? [];

            return (
              <section className="space-y-3" aria-labelledby="participants-title">
                <header className="flex items-center justify-between gap-2">
                  <h2 id="participants-title" className="text-base font-semibold">
                    Participantes
                  </h2>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addParticipant(participantNames)}
                  >
                    Agregar participante
                  </Button>
                </header>

                {participantNames.length === 0 ? (
                  <p className="text-muted-foreground text-sm" role="status">
                    Agregá al menos un participante.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {participantNames.map((participantName: string, index: number) => (
                      <div key={`participant-${index}`} className="flex items-center gap-2">
                        <Input
                          placeholder={`Participante ${index + 1}`}
                          value={participantName}
                          onChange={(event) =>
                            updateParticipantName(participantNames, index, event.target.value)
                          }
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => removeParticipant(participantNames, index)}
                          aria-label={`Eliminar participante ${index + 1}`}
                        >
                          Quitar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {form.formState.errors.participantNames?.message ? (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.participantNames.message}
                  </p>
                ) : null}
              </section>
            );
          }}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar grupo"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
