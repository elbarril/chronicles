import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { type ObservationFormInput } from "@/domain/form";
import { FormBuilder } from "@/features/forms/components/FormBuilder";
import { useFormActions } from "@/features/forms/hooks/use-form-actions";
import { getDefaultFormInput } from "@/features/forms/lib/form-defaults";
import {
  getObservationForm,
  listAvailableFieldsForForm,
} from "@/features/forms/services/form-service";

function toFormInput(form: Awaited<ReturnType<typeof getObservationForm>>): ObservationFormInput {
  if (!form) {
    return getDefaultFormInput();
  }

  return {
    name: form.name,
    fieldIds: form.fieldIds,
  };
}

export function FormBuilderPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const formId = params.id;
  const mode = formId ? "edit" : "create";
  const actions = useFormActions();
  const createInitialValues = useMemo(() => getDefaultFormInput(), []);

  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [availableFields, setAvailableFields] = useState<
    Awaited<ReturnType<typeof listAvailableFieldsForForm>>
  >([]);
  const [editInitialValues, setEditInitialValues] = useState<ObservationFormInput | null>(
    mode === "edit" ? null : createInitialValues,
  );

  useEffect(() => {
    let isMounted = true;

    void listAvailableFieldsForForm().then((fields) => {
      if (!isMounted) {
        return;
      }

      setAvailableFields(fields);
      setIsLoadingFields(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

  if (isLoadingFields || (mode === "edit" && !editInitialValues)) {
    return <p className="text-muted-foreground text-sm">Cargando formulario...</p>;
  }

  const initialValues = editInitialValues ?? createInitialValues;

  return (
    <section className="space-y-6" aria-labelledby="form-builder-title">
      <nav aria-label="Migas de pan">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/forms">← Volver a formularios</Link>
        </Button>
      </nav>

      <header>
        <h1 id="form-builder-title" className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Elegí los campos y definí el orden para usar este formulario en los encuentros.
        </p>
      </header>

      <FormBuilder
        availableFields={availableFields}
        initialValues={initialValues}
        isSaving={actions.isSaving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/forms")}
      />
    </section>
  );
}
