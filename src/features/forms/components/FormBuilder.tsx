import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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
import { type Field } from "@/domain/field";
import { observationFormInputSchema, type ObservationFormInput } from "@/domain/form";
import { fieldTypeLabel } from "@/features/field-definitions/lib/field-type-meta";
import { formMessages } from "@/features/forms/lib/messages";
import { buildResolver } from "@/lib/zod";

interface FormBuilderProps {
  availableFields: Field[];
  initialValues: ObservationFormInput;
  isSaving: boolean;
  onSubmit: (values: ObservationFormInput) => Promise<void>;
  onCancel: () => void;
}

function moveItem(items: string[], fromIndex: number, toIndex: number): string[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  if (!moved) {
    return items;
  }

  next.splice(toIndex, 0, moved);

  return next;
}

export function FormBuilder({
  availableFields,
  initialValues,
  isSaving,
  onSubmit,
  onCancel,
}: FormBuilderProps): JSX.Element {
  const [announceMessage, setAnnounceMessage] = useState("");

  const form = useForm<ObservationFormInput>({
    resolver: buildResolver(observationFormInputSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const watchedFieldIds = useWatch({
    control: form.control,
    name: "fieldIds",
  });

  const selectedFieldIds = useMemo(() => watchedFieldIds ?? [], [watchedFieldIds]);

  const selectedFields = useMemo(() => {
    const byId = new Map(availableFields.map((field) => [field.id, field]));

    return selectedFieldIds
      .map((fieldId) => byId.get(fieldId))
      .filter((field): field is Field => Boolean(field));
  }, [availableFields, selectedFieldIds]);

  const availableById = useMemo(
    () => new Map(availableFields.map((field) => [field.id, field])),
    [availableFields],
  );

  function addField(fieldId: string): void {
    const current = form.getValues("fieldIds");

    if (current.includes(fieldId)) {
      form.setError("fieldIds", { message: formMessages.duplicateFieldIds });
      return;
    }

    form.clearErrors("fieldIds");
    form.setValue("fieldIds", [...current, fieldId], { shouldValidate: true });
  }

  function removeField(fieldId: string): void {
    const current = form.getValues("fieldIds");
    form.setValue(
      "fieldIds",
      current.filter((id) => id !== fieldId),
      { shouldValidate: true },
    );
  }

  function moveField(fromIndex: number, toIndex: number): void {
    const current = form.getValues("fieldIds");
    const next = moveItem(current, fromIndex, toIndex);

    if (next === current) {
      return;
    }

    form.setValue("fieldIds", next, { shouldValidate: true });

    const movedFieldId = next[toIndex];

    if (!movedFieldId) {
      return;
    }

    const movedField = availableById.get(movedFieldId);
    if (movedField) {
      setAnnounceMessage(`Se movió ${movedField.label} a la posición ${toIndex + 1}.`);
    }
  }

  async function handleSubmit(values: ObservationFormInput) {
    if (values.fieldIds.length === 0) {
      form.setError("fieldIds", { message: formMessages.emptyFieldIds });
      return;
    }

    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem data-tour="forms.new.name-input">
              <FormLabel>Nombre del formulario</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Sesión grupal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <section
          className="grid gap-4 lg:grid-cols-2"
          aria-labelledby="available-fields-title"
          data-tour="forms.new.field-picker"
        >
          <div className="border-border rounded-md border p-4">
            <h2 id="available-fields-title" className="text-base font-semibold">
              Campos disponibles
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Agregá campos activos al formulario.
            </p>

            <ul className="mt-4 space-y-2">
              {availableFields.length === 0 ? (
                <li className="text-muted-foreground text-sm">
                  No hay campos activos para agregar.
                </li>
              ) : (
                availableFields.map((field) => {
                  const isSelected = selectedFieldIds.includes(field.id);

                  return (
                    <li
                      key={field.id}
                      className="border-border flex items-center justify-between gap-2 rounded border p-2"
                    >
                      <div>
                        <p className="font-medium">{field.label}</p>
                        <p className="text-muted-foreground text-xs">
                          {fieldTypeLabel[field.type]}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isSelected}
                        onClick={() => addField(field.id)}
                      >
                        {isSelected ? "Agregado" : "Agregar"}
                      </Button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div
            className="border-border rounded-md border p-4"
            aria-labelledby="selected-fields-title"
          >
            <h2 id="selected-fields-title" className="text-base font-semibold">
              Campos del formulario
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Reordená con subir y bajar. El orden define cómo se mostrará en observaciones.
            </p>

            {selectedFields.length === 0 ? (
              <p className="text-muted-foreground mt-4 text-sm" role="status">
                Agregá al menos un campo para guardar el formulario.
              </p>
            ) : (
              <ol className="mt-4 space-y-2">
                {selectedFields.map((field, index) => (
                  <li
                    key={field.id}
                    className="border-border flex items-center justify-between gap-2 rounded border p-2"
                  >
                    <div>
                      <p className="font-medium">{field.label}</p>
                      <p className="text-muted-foreground text-xs">{fieldTypeLabel[field.type]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={index === 0}
                        aria-label={`Subir campo ${field.label}`}
                        onClick={() => moveField(index, index - 1)}
                      >
                        ↑ Subir
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={index === selectedFields.length - 1}
                        aria-label={`Bajar campo ${field.label}`}
                        onClick={() => moveField(index, index + 1)}
                      >
                        ↓ Bajar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        aria-label={`Quitar campo ${field.label}`}
                        onClick={() => removeField(field.id)}
                      >
                        Quitar
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {announceMessage}
            </div>
          </div>
        </section>

        <FormField
          control={form.control}
          name="fieldIds"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving} data-tour="forms.new.save-button">
            {isSaving ? "Guardando..." : "Guardar formulario"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
