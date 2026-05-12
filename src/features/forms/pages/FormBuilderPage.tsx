import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { type FieldFormInput } from "@/domain/field";
import { type ObservationFormInput } from "@/domain/form";
import { useFieldActions } from "@/features/field-definitions/hooks/use-field-actions";
import { useFields } from "@/features/field-definitions/hooks/use-fields";
import { FormBuilder } from "@/features/forms/components/FormBuilder";
import { useFormActions } from "@/features/forms/hooks/use-form-actions";
import { getDefaultFormInput } from "@/features/forms/lib/form-defaults";
import { getObservationForm } from "@/features/forms/services/form-service";

function toFormInput(form: Awaited<ReturnType<typeof getObservationForm>>): ObservationFormInput {
  if (!form) {
    return getDefaultFormInput();
  }

  return {
    name: form.name,
    fields: form.fields.map((instance) => ({
      instanceId: instance.instanceId,
      fieldId: instance.fieldId,
      labelOverride: instance.labelOverride,
    })),
  };
}

export function FormBuilderPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const formId = params.id;
  const mode = formId ? "edit" : "create";
  const actions = useFormActions();
  const fieldActions = useFieldActions();
  const createInitialValues = useMemo(() => getDefaultFormInput(), []);

  // Available fields via live query (so they refresh after ManageFieldsDialog adds one)
  const { fields: availableFields, isLoading: isLoadingFields } = useFields("active");

  const [editInitialValues, setEditInitialValues] = useState<ObservationFormInput | null>(
    mode === "edit" ? null : createInitialValues,
  );

  useEffect(() => {
    if (!formId) {
      return;
    }

    let isMounted = true;

    void getObservationForm(formId).then((form) => {
      if (!isMounted) {
        return;
      }

      if (!form) {
        navigate("/forms", { replace: true });
        return;
      }

      setEditInitialValues(toFormInput(form));
    });

    return () => {
      isMounted = false;
    };
  }, [formId, navigate]);

  const title = useMemo(
    () => (mode === "create" ? "Nuevo formulario" : "Editar formulario"),
    [mode],
  );

  async function handleSubmit(values: ObservationFormInput): Promise<void> {
    if (mode === "create") {
      await actions.create(values);
      navigate("/forms");
      return;
    }

    if (!formId) {
      return;
    }

    await actions.update(formId, values);
    navigate("/forms");
  }

  async function handleCreateField(fieldInput: FieldFormInput) {
    return fieldActions.create(fieldInput);
  }

  if (isLoadingFields || (mode === "edit" && !editInitialValues)) {
    return <p className="text-muted-foreground text-sm">Cargando formulario...</p>;
  }

  const initialValues = editInitialValues ?? createInitialValues;

  return (
    <section className="space-y-6" aria-labelledby="form-builder-title">
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/" },
          { label: "Formularios", to: "/forms" },
          { label: title },
        ]}
      />

      <header>
        <h1 id="form-builder-title" className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Elegí los campos y definí el orden para usar este formulario en los encuentros.
        </p>
      </header>

      <FormBuilder
        availableFields={availableFields ?? []}
        initialValues={initialValues}
        isSaving={actions.isSaving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/forms")}
        onCreateField={handleCreateField}
      />
    </section>
  );
}
