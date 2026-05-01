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
import { encounterInputSchema, type EncounterInput } from "@/domain/encounter";
import { buildResolver } from "@/lib/zod";

interface EncounterFormProps {
  initialValues: EncounterInput;
  groups: Array<{
    id: string;
    name: string;
  }>;
  forms: Array<{
    id: string;
    name: string;
    version: number;
  }>;
  isSaving: boolean;
  onSubmit: (values: EncounterInput) => Promise<void>;
  onCancel: () => void;
}

export function EncounterForm({
  initialValues,
  groups,
  forms,
  isSaving,
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

  async function handleSubmit(values: EncounterInput): Promise<void> {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actividad</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Juego cooperativo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem data-tour="encounters.new.group-selector">
              <FormLabel>Grupo</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                >
                  <option value="">Seleccioná un grupo</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formId"
          render={({ field }) => (
            <FormItem data-tour="encounters.new.form-selector">
              <FormLabel>Formulario</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                >
                  <option value="">Seleccioná un formulario</option>
                  {forms.map((formOption) => (
                    <option key={formOption.id} value={formOption.id}>
                      {formOption.name} (v{formOption.version})
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving} data-tour="encounters.new.start-button">
            {isSaving ? "Guardando..." : "Crear encuentro"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
