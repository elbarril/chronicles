import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { MediaItem } from "@/components/media/MediaItem";
import { MediaPreview } from "@/components/media/MediaPreview";
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
import { type FormFieldInstance } from "@/domain/form";
import { type Observation } from "@/domain/observation";
import { fieldTypeLabel } from "@/features/field-definitions/lib/field-type-meta";
import { useObservationForms } from "@/features/forms/hooks/use-forms";
import { observationMessages } from "@/features/observations/lib/messages";
import { listObservationFormInstances } from "@/features/observations/services/observation-service";
import { useAudioRecorder } from "@/infra/media/recorder";
import { useAudioTranscriber } from "@/infra/media/transcriber";
import { buildResolver } from "@/lib/zod";

interface ParticipantOption {
  id: string;
  displayName: string;
}

interface ObservationFormValues {
  formId: string;
  participantId?: string;
  title?: string;
  values: Record<string, unknown>;
}

interface ObservationSubmitValues {
  formId: string;
  participantId?: string;
  title?: string;
  values: Record<string, unknown>;
}

interface ObservationFormProps {
  participants: ParticipantOption[];
  initialObservation?: Observation;
  isSaving: boolean;
  onSubmit: (values: ObservationSubmitValues) => Promise<void>;
  onCancel?: () => void;
}

function getDefaultValue(field: Field): unknown {
  switch (field.type) {
    case "boolean":
      return false;
    case "multiChoice":
      return [];
    default:
      return "";
  }
}

function buildInitialValues(observation: Observation | undefined): ObservationFormValues {
  return {
    formId: observation?.formId ?? "",
    participantId: observation?.participantId,
    title: observation?.title ?? "",
    values: observation ? { ...observation.values } : {},
  };
}

function parseFieldValue(field: Field, value: string): unknown {
  if (field.type === "number" || field.type === "rating") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? "" : parsed;
  }

  if (field.type === "boolean") {
    return value === "true";
  }

  return value;
}

type MediaField = Field & { type: "image" | "video" | "audio" | "file" };

function isMediaField(field: Field): field is MediaField {
  return (
    field.type === "image" ||
    field.type === "video" ||
    field.type === "audio" ||
    field.type === "file"
  );
}

function getMediaConfig(field: Field): { accept?: string; multiple?: boolean } {
  if (!isMediaField(field)) {
    return {};
  }

  return field.config as { accept?: string; multiple?: boolean };
}

type MediaFieldKind = "audio" | "video" | "image" | "file";

function isMediaRefValue(value: unknown): value is { mediaId: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "mediaId" in value &&
    typeof (value as { mediaId: unknown }).mediaId === "string"
  );
}

function isMediaRefListValue(value: unknown): value is { mediaIds: string[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "mediaIds" in value &&
    Array.isArray((value as { mediaIds: unknown }).mediaIds)
  );
}

function MediaFieldPreview({
  value,
  kind,
  label,
}: {
  value: unknown;
  kind: MediaFieldKind;
  label: string;
}): JSX.Element | null {
  if (value instanceof Blob) {
    return <MediaPreview blob={value} kind={kind} label={label} />;
  }

  if (Array.isArray(value) && value.every((item): item is Blob => item instanceof Blob)) {
    if (value.length === 0) {
      return null;
    }

    return (
      <ul className="space-y-2">
        {value.map((blob, index) => (
          <li key={index}>
            <MediaPreview blob={blob} kind={kind} label={label} />
          </li>
        ))}
      </ul>
    );
  }

  if (isMediaRefValue(value)) {
    return <MediaItem mediaId={value.mediaId} kind={kind} label={label} />;
  }

  if (isMediaRefListValue(value)) {
    if (value.mediaIds.length === 0) {
      return null;
    }

    return (
      <ul className="space-y-2">
        {value.mediaIds.map((mediaId) => (
          <li key={mediaId}>
            <MediaItem mediaId={mediaId} kind={kind} label={label} />
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export function ObservationForm({
  participants,
  initialObservation,
  isSaving,
  onSubmit,
  onCancel,
}: ObservationFormProps): JSX.Element {
  const isEditing = Boolean(initialObservation);
  const { forms: activeForms } = useObservationForms("active");
  const formSchema = z.object({
    formId: z.string().uuid(),
    participantId: z.string().uuid().optional(),
    title: z.string().optional(),
    values: z.record(z.string(), z.unknown()),
  });

  const form = useForm<ObservationFormValues>({
    resolver: buildResolver(formSchema),
    defaultValues: buildInitialValues(initialObservation),
  });

  const selectedFormId = form.watch("formId");

  // Each entry pairs a form-field instance with its resolved Field definition.
  const [instancesWithFields, setInstancesWithFields] = useState<
    Array<{ instance: FormFieldInstance; field: Field }>
  >([]);
  const [isLoadingFields, setIsLoadingFields] = useState(false);

  const formOptions = useMemo(() => {
    if (!isEditing) {
      return activeForms;
    }

    // When editing we don't allow switching forms; just expose the current one.
    return activeForms.filter((option) => option.id === initialObservation?.formId);
  }, [activeForms, isEditing, initialObservation]);

  useEffect(() => {
    form.reset(buildInitialValues(initialObservation));
  }, [form, initialObservation]);

  useEffect(() => {
    if (!selectedFormId) {
      setInstancesWithFields([]);
      return;
    }

    let isMounted = true;
    setIsLoadingFields(true);

    // When editing, re-use the snapshot stored on the observation itself so
    // that adding/removing fields from the live form doesn't change what the
    // user sees while editing an existing observation.
    const resolvePromise: Promise<{
      instances: FormFieldInstance[];
      fieldsById: Map<string, Field>;
    }> =
      isEditing && initialObservation
        ? (async () => {
            const { listFieldsByIds } = await import("@/infra/db/repositories/field-repository");
            const allFieldIds = [...new Set(initialObservation.fields.map((inst) => inst.fieldId))];
            const fields = await listFieldsByIds(allFieldIds);
            const fieldsById = new Map(fields.map((f) => [f.id, f]));
            return { instances: initialObservation.fields, fieldsById };
          })()
        : listObservationFormInstances(selectedFormId);

    void resolvePromise
      .then(({ instances, fieldsById }) => {
        if (!isMounted) return;

        const paired = instances.flatMap((instance) => {
          const field = fieldsById.get(instance.fieldId);
          return field ? [{ instance, field }] : [];
        });

        setInstancesWithFields(paired);

        // Initialise missing entries with their per-type defaults so the
        // controlled inputs always have a value.
        const currentValues = form.getValues("values") ?? {};
        const nextValues: Record<string, unknown> = { ...currentValues };
        for (const { instance, field } of paired) {
          if (nextValues[instance.instanceId] === undefined) {
            nextValues[instance.instanceId] = getDefaultValue(field);
          }
        }
        form.setValue("values", nextValues, { shouldValidate: false });
      })
      .catch(() => {
        if (!isMounted) return;
        toast.error(observationMessages.formNotFound);
      })
      .finally(() => {
        if (isMounted) setIsLoadingFields(false);
      });

    return () => {
      isMounted = false;
    };
  }, [form, selectedFormId, isEditing, initialObservation]);

  const transcriber = useAudioTranscriber({
    onTranscript: (text) => {
      // Find the audio field with transcription enabled
      const audioEntry = instancesWithFields.find(
        ({ field }) =>
          field.type === "audio" &&
          (field.config as { transcriptionEnabled?: boolean }).transcriptionEnabled,
      );

      if (!audioEntry) return;

      const audioConfig = audioEntry.field.config as {
        transcriptionEnabled?: boolean;
        transcriptionTargetFieldId?: string;
      };

      if (!audioConfig.transcriptionEnabled) return;

      let textEntry;

      if (audioConfig.transcriptionTargetFieldId) {
        // Use the specified target field
        const targetFieldId = audioConfig.transcriptionTargetFieldId;
        textEntry = instancesWithFields.find(({ field }) => field.id === targetFieldId);
      } else {
        // Auto-created field: look for a text field with the expected key pattern
        const expectedKey = `transcripcion_${audioEntry.field.key}`;
        textEntry = instancesWithFields.find(
          ({ field }) =>
            (field.type === "text" || field.type === "longText") && field.key === expectedKey,
        );
      }

      if (textEntry) {
        form.setValue(`values.${textEntry.instance.instanceId}`, text, {
          shouldValidate: false,
        });
      }
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const audioRecorder = useAudioRecorder({
    onStop: (blob) => {
      const audioEntry = instancesWithFields.find(({ field }) => field.type === "audio");

      if (!audioEntry) {
        return;
      }

      form.setValue(`values.${audioEntry.instance.instanceId}`, blob, {
        shouldValidate: true,
      });

      // Stop transcription when recording stops
      transcriber.stop();
    },
  });

  useEffect(() => {
    if (audioRecorder.state === "denied") {
      toast.error(observationMessages.recorderDenied);
    }

    if (audioRecorder.state === "unsupported") {
      toast.error(observationMessages.recorderUnsupported);
    }
  }, [audioRecorder.state]);

  async function handleSubmit(values: ObservationFormValues): Promise<void> {
    if (!values.formId) {
      toast.error(observationMessages.formRequired);
      return;
    }

    const parsed = formSchema.safeParse(values);

    if (!parsed.success) {
      toast.error(observationMessages.createError);
      return;
    }

    await onSubmit(values);

    audioRecorder.clear();

    if (!initialObservation) {
      form.reset(buildInitialValues(undefined));
      setInstancesWithFields([]);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <FormField
          control={form.control}
          name="formId"
          render={({ field }) => (
            <FormItem data-tour="observations.new.form-selector">
              <FormLabel>Formulario</FormLabel>
              <FormControl>
                <select
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  disabled={isEditing}
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                >
                  <option value="">Seleccioná un formulario</option>
                  {formOptions.map((formOption) => (
                    <option key={formOption.id} value={formOption.id}>
                      {formOption.name}
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={String(field.value ?? "")}
                  onChange={(event) => field.onChange(event.target.value)}
                  placeholder="Sin título"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participante (opcional)</FormLabel>
              <FormControl>
                <select
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || undefined)}
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                >
                  <option value="">Sin participante</option>
                  {participants.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.displayName}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedFormId && isLoadingFields ? (
          <p className="text-muted-foreground text-sm">Cargando campos...</p>
        ) : null}

        {instancesWithFields.map(({ instance, field }) => {
          const displayLabel = instance.labelOverride?.trim() || field.label;

          return (
            <FormField
              key={instance.instanceId}
              control={form.control}
              name={`values.${instance.instanceId}`}
              render={({ field: valueField }) => {
                const mediaConfig = getMediaConfig(field);

                return (
                  <FormItem>
                    <FormLabel>
                      {displayLabel}{" "}
                      <span className="text-muted-foreground text-xs">
                        ({fieldTypeLabel[field.type]})
                      </span>
                    </FormLabel>
                    <FormControl>
                      {isMediaField(field) ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept={mediaConfig.accept}
                            multiple={Boolean(mediaConfig.multiple)}
                            capture={
                              field.type === "image" || field.type === "video"
                                ? "environment"
                                : undefined
                            }
                            onChange={(event) => {
                              const files = Array.from(event.target.files ?? []);

                              if (files.length === 0) {
                                valueField.onChange(mediaConfig.multiple ? [] : "");
                                return;
                              }

                              valueField.onChange(mediaConfig.multiple ? files : files[0]);
                            }}
                          />

                          {field.type === "audio" && !mediaConfig.multiple ? (
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={audioRecorder.isRecording}
                                onClick={async () => {
                                  await audioRecorder.start();
                                  // Check if this audio field has transcription enabled
                                  const audioConfig = field.config as {
                                    transcriptionEnabled?: boolean;
                                  };
                                  if (audioConfig.transcriptionEnabled) {
                                    transcriber.start();
                                  }
                                }}
                              >
                                Grabar audio
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                disabled={!audioRecorder.isRecording}
                                onClick={audioRecorder.stop}
                              >
                                Detener grabación
                              </Button>
                            </div>
                          ) : null}

                          <MediaFieldPreview
                            value={valueField.value}
                            kind={field.type}
                            label={displayLabel}
                          />
                        </div>
                      ) : field.type === "longText" ? (
                        <textarea
                          className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                          value={String(valueField.value ?? "")}
                          onChange={(event) => valueField.onChange(event.target.value)}
                        />
                      ) : field.type === "singleChoice" ? (
                        <select
                          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                          value={String(valueField.value ?? "")}
                          onChange={(event) => valueField.onChange(event.target.value)}
                        >
                          <option value="">Seleccioná una opción</option>
                          {field.type === "singleChoice"
                            ? field.config.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))
                            : null}
                        </select>
                      ) : field.type === "multiChoice" ? (
                        <div className="space-y-2">
                          {field.config.options.map((option) => {
                            const currentValues = Array.isArray(valueField.value)
                              ? (valueField.value as string[])
                              : [];

                            return (
                              <label key={option} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={currentValues.includes(option)}
                                  onChange={(event) => {
                                    const next = event.target.checked
                                      ? [...currentValues, option]
                                      : currentValues.filter((value) => value !== option);
                                    valueField.onChange(next);
                                  }}
                                />
                                {option}
                              </label>
                            );
                          })}
                        </div>
                      ) : field.type === "boolean" ? (
                        <input
                          type="checkbox"
                          checked={Boolean(valueField.value)}
                          onChange={(event) => valueField.onChange(event.target.checked)}
                        />
                      ) : (
                        <Input
                          type={
                            field.type === "number" || field.type === "rating" ? "number" : "text"
                          }
                          value={String(valueField.value ?? "")}
                          onChange={(event) =>
                            valueField.onChange(parseFieldValue(field, event.target.value))
                          }
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          );
        })}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSaving || !selectedFormId}>
            {isSaving
              ? "Guardando..."
              : initialObservation
                ? "Actualizar observación"
                : "Guardar observación"}
          </Button>
          {onCancel ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
