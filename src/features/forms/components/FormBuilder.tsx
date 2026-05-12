import { useEffect, useMemo, useRef, useState } from "react";
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
import { type Field, type FieldFormInput } from "@/domain/field";
import {
  observationFormInputSchema,
  type FormFieldInstanceInput,
  type ObservationFormInput,
} from "@/domain/form";
import { getDefaultFieldInput } from "@/features/field-definitions/lib/field-defaults";
import { fieldTypeLabel } from "@/features/field-definitions/lib/field-type-meta";
import { ManageFieldsDialog } from "@/features/forms/components/ManageFieldsDialog";
import { formMessages } from "@/features/forms/lib/messages";
import { buildResolver } from "@/lib/zod";

interface FormBuilderProps {
  availableFields: Field[];
  initialValues: ObservationFormInput;
  isSaving: boolean;
  onSubmit: (values: ObservationFormInput) => Promise<void>;
  onCancel: () => void;
  onCreateField?: (fieldInput: FieldFormInput) => Promise<Field>;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
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
  onCreateField,
}: FormBuilderProps): JSX.Element {
  const [announceMessage, setAnnounceMessage] = useState("");
  const [additionalFields, setAdditionalFields] = useState<Field[]>([]);

  const form = useForm<ObservationFormInput>({
    resolver: buildResolver(observationFormInputSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const watchedFields = useWatch({
    control: form.control,
    name: "fields",
  });

  const selectedInstances = useMemo(() => watchedFields ?? [], [watchedFields]);

  const availableById = useMemo(() => {
    const map = new Map(availableFields.map((field) => [field.id, field]));
    // Add additional fields created during this session
    additionalFields.forEach((field) => map.set(field.id, field));
    return map;
  }, [availableFields, additionalFields]);

  // Use a ref to track if it's the first render to avoid overriding initial values
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
    // When available fields change (e.g. after user creates one in the dialog),
    // filter out any instances whose fieldId no longer exists in available fields.
    // (Archived fields are removed from availableFields but their instanceIds in
    //  the form remain valid from existing forms — we keep them to not lose data.)
  }, [availableFields]);

  async function addField(fieldId: string): Promise<void> {
    const field = availableById.get(fieldId);
    const current = form.getValues("fields");
    const newInstance: FormFieldInstanceInput = {
      instanceId: crypto.randomUUID(),
      fieldId,
    };

    const updatedFields = [...current, newInstance];

    // If this is an audio field with transcription enabled, handle target field creation
    if (
      field?.type === "audio" &&
      (field.config as { transcriptionEnabled?: boolean }).transcriptionEnabled
    ) {
      const audioConfig = field.config as {
        transcriptionEnabled?: boolean;
        transcriptionTargetFieldId?: string;
      };
      const targetFieldId = audioConfig.transcriptionTargetFieldId;

      if (targetFieldId) {
        const targetField = availableById.get(targetFieldId);

        // If target field doesn't exist, create it automatically
        if (!targetField && onCreateField) {
          const textFieldInput = getDefaultFieldInput("longText");
          textFieldInput.label = `Transcripción de ${field.label}`;
          textFieldInput.key = `transcripcion_${field.key}`;
          textFieldInput.config = {};

          const createdField = await onCreateField(textFieldInput);

          // Add to additional fields so it appears in the UI
          setAdditionalFields((prev) => [...prev, createdField]);

          // Add the text field instance immediately after the audio field
          const textInstance: FormFieldInstanceInput = {
            instanceId: crypto.randomUUID(),
            fieldId: createdField.id,
          };

          updatedFields.push(textInstance);
          setAnnounceMessage(
            `Se creó automáticamente el campo de texto "${createdField.label}" para la transcripción.`,
          );
        } else if (targetField) {
          // Target field exists, add its instance if not already in the form
          const alreadyInForm = current.some((instance) => instance.fieldId === targetFieldId);
          if (!alreadyInForm) {
            const textInstance: FormFieldInstanceInput = {
              instanceId: crypto.randomUUID(),
              fieldId: targetFieldId,
            };

            updatedFields.push(textInstance);
            setAnnounceMessage(
              `Se agregó el campo de texto "${targetField.label}" para la transcripción.`,
            );
          }
        }
      } else if (onCreateField) {
        // No target field ID specified, create the text field automatically
        const textFieldInput = getDefaultFieldInput("longText");
        textFieldInput.label = `Transcripción de ${field.label}`;
        textFieldInput.key = `transcripcion_${field.key}`;
        textFieldInput.config = {};

        const createdField = await onCreateField(textFieldInput);

        // Add to additional fields so it appears in the UI
        setAdditionalFields((prev) => [...prev, createdField]);

        // Add the text field instance immediately after the audio field
        const textInstance: FormFieldInstanceInput = {
          instanceId: crypto.randomUUID(),
          fieldId: createdField.id,
        };

        updatedFields.push(textInstance);
        setAnnounceMessage(
          `Se creó automáticamente el campo de texto "${createdField.label}" para la transcripción.`,
        );
      }
    }

    form.clearErrors("fields");
    form.setValue("fields", updatedFields, { shouldValidate: true });
  }

  function duplicateInstance(index: number): void {
    const current = form.getValues("fields");
    const source = current[index];

    if (!source) {
      return;
    }

    const duplicate: FormFieldInstanceInput = {
      instanceId: crypto.randomUUID(),
      fieldId: source.fieldId,
      labelOverride: source.labelOverride,
    };

    const next = [...current];
    next.splice(index + 1, 0, duplicate);
    form.setValue("fields", next, { shouldValidate: true });

    const field = availableById.get(source.fieldId);
    if (field) {
      setAnnounceMessage(`Se duplicó el campo ${source.labelOverride ?? field.label}.`);
    }
  }

  function removeInstance(index: number): void {
    const current = form.getValues("fields");
    const instanceToRemove = current[index];

    if (!instanceToRemove) {
      return;
    }

    // Check if this field is a transcription target (cannot be removed)
    const isTranscriptionTarget = current.some((instance) => {
      const field = availableById.get(instance.fieldId);
      if (!field || field.type !== "audio") return false;

      const audioConfig = field.config as {
        transcriptionEnabled?: boolean;
        transcriptionTargetFieldId?: string;
      };

      if (!audioConfig.transcriptionEnabled) return false;

      // Check if this is the specified target field
      if (audioConfig.transcriptionTargetFieldId === instanceToRemove.fieldId) {
        return true;
      }

      // Check if this is an auto-created target field (by key pattern)
      if (!audioConfig.transcriptionTargetFieldId) {
        const expectedKey = `transcripcion_${field.key}`;
        const targetField = availableById.get(instanceToRemove.fieldId);
        return (
          targetField &&
          (targetField.type === "text" || targetField.type === "longText") &&
          targetField.key === expectedKey
        );
      }

      return false;
    });

    if (isTranscriptionTarget) {
      const targetField = availableById.get(instanceToRemove.fieldId);
      setAnnounceMessage(
        `No se puede quitar "${targetField?.label}" porque está vinculado a la transcripción de un campo de audio.`,
      );
      return;
    }

    form.setValue(
      "fields",
      current.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  }

  function isTranscriptionTarget(instance: FormFieldInstanceInput): boolean {
    const current = form.getValues("fields");
    return current.some((inst) => {
      const field = availableById.get(inst.fieldId);
      if (!field || field.type !== "audio") return false;

      const audioConfig = field.config as {
        transcriptionEnabled?: boolean;
        transcriptionTargetFieldId?: string;
      };

      if (!audioConfig.transcriptionEnabled) return false;

      // Check if this is the specified target field
      if (audioConfig.transcriptionTargetFieldId === instance.fieldId) {
        return true;
      }

      // Check if this is an auto-created target field (by key pattern)
      if (!audioConfig.transcriptionTargetFieldId) {
        const expectedKey = `transcripcion_${field.key}`;
        const targetField = availableById.get(instance.fieldId);
        return (
          targetField &&
          (targetField.type === "text" || targetField.type === "longText") &&
          targetField.key === expectedKey
        );
      }

      return false;
    });
  }

  function moveInstance(fromIndex: number, toIndex: number): void {
    const current = form.getValues("fields");
    const next = moveItem(current, fromIndex, toIndex);

    if (next === current) {
      return;
    }

    form.setValue("fields", next, { shouldValidate: true });

    const movedInstance = next[toIndex];

    if (!movedInstance) {
      return;
    }

    const field = availableById.get(movedInstance.fieldId);
    if (field) {
      setAnnounceMessage(
        `Se movió ${movedInstance.labelOverride ?? field.label} a la posición ${toIndex + 1}.`,
      );
    }
  }

  function updateLabelOverride(index: number, value: string): void {
    const current = form.getValues("fields");
    const instance = current[index];

    if (!instance) {
      return;
    }

    const updated = [...current];
    updated[index] = {
      ...instance,
      labelOverride: value.trim() || undefined,
    };
    form.setValue("fields", updated, { shouldValidate: false });
  }

  async function handleSubmit(values: ObservationFormInput) {
    if (values.fields.length === 0) {
      form.setError("fields", { message: formMessages.emptyFields });
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

        <section aria-labelledby="field-picker-title" data-tour="forms.new.field-picker">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 id="field-picker-title" className="text-base font-semibold">
                Campos del formulario
              </h2>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Agregá campos, reordená con ↑↓, duplicalos o quitálos. El mismo campo puede aparecer
                más de una vez con etiquetas distintas.
              </p>
            </div>
            <ManageFieldsDialog />
          </div>

          {/* Available fields picker */}
          <div
            className="border-border mb-4 rounded-md border p-4"
            aria-labelledby="available-fields-title"
          >
            <h3 id="available-fields-title" className="mb-3 text-sm font-medium">
              Campos disponibles
            </h3>
            {availableFields.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay campos activos. Usá &quot;Editar campos&quot; para crear uno.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {availableFields.map((field) => (
                  <li key={field.id}>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addField(field.id)}
                    >
                      + {field.label}{" "}
                      <span className="text-muted-foreground ml-1 text-xs">
                        ({fieldTypeLabel[field.type]})
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Selected instances */}
          {selectedInstances.length === 0 ? (
            <p className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
              Agregá al menos un campo usando los botones de arriba.
            </p>
          ) : (
            <ol className="space-y-3" aria-label="Campos seleccionados del formulario">
              {selectedInstances.map((instance, index) => {
                const field = availableById.get(instance.fieldId);
                const displayLabel = instance.labelOverride ?? field?.label ?? instance.fieldId;
                const typeLabel = field ? fieldTypeLabel[field.type] : "campo desconocido";
                const isTarget = isTranscriptionTarget(instance);

                return (
                  <li
                    key={instance.instanceId ?? index}
                    className="border-border flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-start"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{displayLabel}</p>
                        {isTarget && (
                          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                            Transcripción
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {typeLabel}
                        {field && instance.labelOverride ? ` · base: ${field.label}` : ""}
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder={field?.label ?? "Etiqueta personalizada"}
                          value={instance.labelOverride ?? ""}
                          onChange={(e) => updateLabelOverride(index, e.target.value)}
                          className="h-7 text-xs"
                          aria-label={`Etiqueta personalizada para el campo ${field?.label ?? ""} (posición ${index + 1})`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:flex-nowrap">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={index === 0}
                        aria-label={`Subir ${displayLabel}`}
                        onClick={() => moveInstance(index, index - 1)}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={index === selectedInstances.length - 1}
                        aria-label={`Bajar ${displayLabel}`}
                        onClick={() => moveInstance(index, index + 1)}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-label={`Duplicar ${displayLabel}`}
                        data-tour={index === 0 ? "forms.builder.duplicate-instance" : undefined}
                        onClick={() => duplicateInstance(index)}
                      >
                        Duplicar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isTarget}
                        aria-label={`Quitar ${displayLabel}`}
                        onClick={() => removeInstance(index)}
                      >
                        Quitar
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {announceMessage}
          </div>
        </section>

        <FormField
          control={form.control}
          name="fields"
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
