import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { type FieldFormInput } from "@/domain/field";
import { FieldForm } from "@/features/field-definitions/components/FieldForm";
import { useFieldActions } from "@/features/field-definitions/hooks/use-field-actions";
import { getDefaultFieldInput } from "@/features/field-definitions/lib/field-defaults";
import { getFieldDefinition } from "@/features/field-definitions/services/field-service";

function toFormInput(field: Awaited<ReturnType<typeof getFieldDefinition>>): FieldFormInput {
  if (!field) {
    return getDefaultFieldInput("text");
  }

  return {
    key: field.key,
    label: field.label,
    type: field.type,
    required: field.required,
    helpText: field.helpText,
    config: field.config,
  } as FieldFormInput;
}

export function FieldFormPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const fieldId = params.id;
  const mode = fieldId ? "edit" : "create";
  const actions = useFieldActions();
  const createInitialValues = useMemo(() => getDefaultFieldInput("text"), []);

  const [editInitialValues, setEditInitialValues] = useState<FieldFormInput | null>(
    mode === "edit" ? null : createInitialValues,
  );

  useEffect(() => {
    if (!fieldId) {
      return;
    }

    let isMounted = true;

    void getFieldDefinition(fieldId).then((field) => {
      if (!isMounted) {
        return;
      }

      if (!field) {
        navigate("/fields", { replace: true });
        return;
      }

      setEditInitialValues(toFormInput(field));
    });

    return () => {
      isMounted = false;
    };
  }, [fieldId, navigate]);

  const title = useMemo(() => (mode === "create" ? "Nuevo campo" : "Editar campo"), [mode]);

  async function handleSubmit(values: FieldFormInput): Promise<void> {
    if (mode === "create") {
      await actions.create(values);
      navigate("/fields");
      return;
    }

    if (!fieldId) {
      return;
    }

    await actions.update(fieldId, values);
    navigate("/fields");
  }

  if (mode === "edit" && !editInitialValues) {
    return <p className="text-muted-foreground text-sm">Cargando datos del campo...</p>;
  }

  const initialValues = editInitialValues ?? createInitialValues;

  return (
    <section className="space-y-6" aria-labelledby="field-form-title">
      <header>
        <h1 id="field-form-title" className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Completá la configuración para usar este campo en formularios de observación.
        </p>
      </header>

      <FieldForm
        initialValues={initialValues}
        isSaving={actions.isSaving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/fields")}
      />
    </section>
  );
}
