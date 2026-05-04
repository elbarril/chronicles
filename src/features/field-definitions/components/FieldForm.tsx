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
import { type FieldFormInput, fieldFormSchema, type FieldType } from "@/domain/field";
import { fieldTypeLabel } from "@/features/field-definitions/lib/field-type-meta";
import {
  createDefaultConfigForType,
  createFieldKeyFromLabel,
  getFieldTypes,
} from "@/features/field-definitions/services/field-service";
import { buildResolver } from "@/lib/zod";

interface FieldFormProps {
  initialValues: FieldFormInput;
  isSaving: boolean;
  onSubmit: (values: FieldFormInput) => Promise<void>;
  onCancel: () => void;
}

function parseNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? undefined : parsed;
}

export function FieldForm({
  initialValues,
  isSaving,
  onSubmit,
  onCancel,
}: FieldFormProps): JSX.Element {
  const form = useForm<FieldFormInput>({
    resolver: buildResolver(fieldFormSchema),
    defaultValues: initialValues,
  });

  const currentType = form.watch("type") as FieldType;
  const currentLabel = form.watch("label");

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  // The technical key is no longer surfaced in the UI: derive it from the
  // label so form composition and uniqueness checks keep working transparently.
  useEffect(() => {
    form.setValue("key", createFieldKeyFromLabel(currentLabel), { shouldValidate: true });
  }, [currentLabel, form]);

  useEffect(() => {
    const existingType = form.getValues("type");

    if (!existingType || existingType !== currentType) {
      return;
    }

    const currentConfig = form.getValues("config");
    const defaultConfig = createDefaultConfigForType(currentType);

    if (JSON.stringify(currentConfig) === JSON.stringify(defaultConfig)) {
      return;
    }

    form.setValue("config", currentConfig, { shouldValidate: false });
  }, [currentType, form]);

  const fieldTypeOptions = useMemo(() => getFieldTypes(), []);

  async function handleSubmit(values: FieldFormInput) {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <section className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem data-tour="fields.new.name-input">
                <FormLabel>Nombre del campo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Nivel de participación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem data-tour="fields.type-selector">
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <select
                    className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                    {...field}
                    onChange={(event) => {
                      const nextType = event.target.value as FieldType;
                      field.onChange(nextType);
                      form.setValue("config", createDefaultConfigForType(nextType), {
                        shouldValidate: true,
                      });
                    }}
                  >
                    {fieldTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {fieldTypeLabel[type]}
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
            name="required"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Obligatorio</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <FormField
          control={form.control}
          name="helpText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de ayuda (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Se muestra debajo del campo en el formulario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <fieldset className="border-border space-y-4 rounded-md border p-4">
          <legend className="px-2 text-sm font-medium">Configuración específica</legend>

          {(currentType === "text" || currentType === "longText") && (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="config-maxLength">
                Largo máximo
              </label>
              <input
                id="config-maxLength"
                type="number"
                className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                value={String((form.watch("config") as { maxLength?: number }).maxLength ?? "")}
                onChange={(event) => {
                  form.setValue(
                    "config",
                    {
                      maxLength: parseNumber(event.target.value),
                    },
                    { shouldValidate: true },
                  );
                }}
              />
            </div>
          )}

          {currentType === "number" && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium" htmlFor="config-number-min">
                <span>Mínimo</span>
                <input
                  id="config-number-min"
                  type="number"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={String((form.watch("config") as { min?: number }).min ?? "")}
                  onChange={(event) => {
                    const config = form.watch("config") as { min?: number; max?: number };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        min: parseNumber(event.target.value),
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>

              <label className="space-y-2 text-sm font-medium" htmlFor="config-number-max">
                <span>Máximo</span>
                <input
                  id="config-number-max"
                  type="number"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={String((form.watch("config") as { max?: number }).max ?? "")}
                  onChange={(event) => {
                    const config = form.watch("config") as { min?: number; max?: number };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        max: parseNumber(event.target.value),
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>
            </div>
          )}

          {(currentType === "singleChoice" || currentType === "multiChoice") && (
            <div className="space-y-3">
              <label className="text-sm font-medium" htmlFor="config-options">
                Opciones (una por línea)
              </label>
              <textarea
                id="config-options"
                className="border-input bg-background min-h-28 w-full rounded-md border px-3 py-2 text-sm"
                value={((form.watch("config") as { options?: string[] }).options ?? []).join("\n")}
                onChange={(event) => {
                  const options = event.target.value
                    .split("\n")
                    .map((option) => option.trim())
                    .filter(Boolean);

                  if (currentType === "singleChoice") {
                    form.setValue("config", { options }, { shouldValidate: true });
                    return;
                  }

                  const config = form.watch("config") as {
                    options: string[];
                    minSelect?: number;
                    maxSelect?: number;
                  };

                  form.setValue(
                    "config",
                    {
                      ...config,
                      options,
                    },
                    { shouldValidate: true },
                  );
                }}
              />

              {currentType === "multiChoice" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium" htmlFor="config-multi-min">
                    <span>Mínima selección</span>
                    <input
                      id="config-multi-min"
                      type="number"
                      className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                      value={String(
                        (form.watch("config") as { minSelect?: number }).minSelect ?? "",
                      )}
                      onChange={(event) => {
                        const config = form.watch("config") as {
                          options: string[];
                          minSelect?: number;
                          maxSelect?: number;
                        };

                        form.setValue(
                          "config",
                          {
                            ...config,
                            minSelect: parseNumber(event.target.value),
                          },
                          { shouldValidate: true },
                        );
                      }}
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium" htmlFor="config-multi-max">
                    <span>Máxima selección</span>
                    <input
                      id="config-multi-max"
                      type="number"
                      className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                      value={String(
                        (form.watch("config") as { maxSelect?: number }).maxSelect ?? "",
                      )}
                      onChange={(event) => {
                        const config = form.watch("config") as {
                          options: string[];
                          minSelect?: number;
                          maxSelect?: number;
                        };

                        form.setValue(
                          "config",
                          {
                            ...config,
                            maxSelect: parseNumber(event.target.value),
                          },
                          { shouldValidate: true },
                        );
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {(currentType === "image" ||
            currentType === "video" ||
            currentType === "audio" ||
            currentType === "file") && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium" htmlFor="config-accept">
                <span>accept (opcional)</span>
                <input
                  id="config-accept"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={String((form.watch("config") as { accept?: string }).accept ?? "")}
                  onChange={(event) => {
                    const config = form.watch("config") as { accept?: string; multiple?: boolean };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        accept: event.target.value.trim() || undefined,
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>

              <label className="space-y-2 text-sm font-medium" htmlFor="config-multiple">
                <span>Permitir múltiples archivos</span>
                <input
                  id="config-multiple"
                  type="checkbox"
                  className="h-5 w-5"
                  checked={Boolean((form.watch("config") as { multiple?: boolean }).multiple)}
                  onChange={(event) => {
                    const config = form.watch("config") as { accept?: string; multiple?: boolean };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        multiple: event.target.checked,
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>
            </div>
          )}

          {currentType === "rating" && (
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm font-medium" htmlFor="config-rating-min">
                <span>Mínimo</span>
                <input
                  id="config-rating-min"
                  type="number"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={String((form.watch("config") as { min?: number }).min ?? 1)}
                  onChange={(event) => {
                    const config = form.watch("config") as {
                      min: number;
                      max: number;
                      step?: number;
                    };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        min: parseNumber(event.target.value) ?? 1,
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>

              <label className="space-y-2 text-sm font-medium" htmlFor="config-rating-max">
                <span>Máximo</span>
                <input
                  id="config-rating-max"
                  type="number"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={String((form.watch("config") as { max?: number }).max ?? 5)}
                  onChange={(event) => {
                    const config = form.watch("config") as {
                      min: number;
                      max: number;
                      step?: number;
                    };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        max: parseNumber(event.target.value) ?? 5,
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>

              <label className="space-y-2 text-sm font-medium" htmlFor="config-rating-step">
                <span>Paso</span>
                <input
                  id="config-rating-step"
                  type="number"
                  step="0.5"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={String((form.watch("config") as { step?: number }).step ?? 1)}
                  onChange={(event) => {
                    const config = form.watch("config") as {
                      min: number;
                      max: number;
                      step?: number;
                    };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        step: parseNumber(event.target.value) ?? 1,
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>
            </div>
          )}

          {(currentType === "date" || currentType === "time" || currentType === "datetime") && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium" htmlFor="config-date-min">
                <span>Mínimo</span>
                <input
                  id="config-date-min"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={String((form.watch("config") as { min?: string }).min ?? "")}
                  onChange={(event) => {
                    const config = form.watch("config") as { min?: string; max?: string };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        min: event.target.value || undefined,
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>

              <label className="space-y-2 text-sm font-medium" htmlFor="config-date-max">
                <span>Máximo</span>
                <input
                  id="config-date-max"
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={String((form.watch("config") as { max?: string }).max ?? "")}
                  onChange={(event) => {
                    const config = form.watch("config") as { min?: string; max?: string };
                    form.setValue(
                      "config",
                      {
                        ...config,
                        max: event.target.value || undefined,
                      },
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>
            </div>
          )}

          {(currentType === "boolean" || currentType === "location") && (
            <p className="text-muted-foreground text-sm">
              Este tipo no requiere configuración adicional.
            </p>
          )}
        </fieldset>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving} data-tour="fields.save-button">
            {isSaving ? "Guardando..." : "Guardar campo"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
