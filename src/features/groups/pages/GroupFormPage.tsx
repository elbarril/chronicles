import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { type GroupInput } from "@/domain/group";
import { GroupForm } from "@/features/groups/components/GroupForm";
import { useGroupActions } from "@/features/groups/hooks/use-group-actions";
import { getDefaultGroupInput } from "@/features/groups/lib/group-defaults";
import { getGroupDefinition } from "@/features/groups/services/group-service";

function toFormInput(group: Awaited<ReturnType<typeof getGroupDefinition>>): GroupInput {
  if (!group) {
    return getDefaultGroupInput();
  }

  return {
    name: group.name,
    participantNames: group.participants.map((participant) => participant.displayName),
  };
}

export function GroupFormPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const groupId = params.id;
  const mode = groupId ? "edit" : "create";
  const actions = useGroupActions();
  const createInitialValues = useMemo(() => getDefaultGroupInput(), []);

  const [editInitialValues, setEditInitialValues] = useState<GroupInput | null>(
    mode === "edit" ? null : createInitialValues,
  );

  useEffect(() => {
    if (!groupId) {
      return;
    }

    let isMounted = true;

    void getGroupDefinition(groupId).then((group) => {
      if (!isMounted) {
        return;
      }

      if (!group) {
        navigate("/groups", { replace: true });
        return;
      }

      setEditInitialValues(toFormInput(group));
    });

    return () => {
      isMounted = false;
    };
  }, [groupId, navigate]);

  const title = useMemo(() => (mode === "create" ? "Nuevo grupo" : "Editar grupo"), [mode]);

  async function handleSubmit(values: GroupInput): Promise<void> {
    if (mode === "create") {
      await actions.create(values);
      navigate("/groups");
      return;
    }

    if (!groupId) {
      return;
    }

    await actions.update(groupId, values);
    navigate("/groups");
  }

  if (mode === "edit" && !editInitialValues) {
    return <p className="text-muted-foreground text-sm">Cargando grupo...</p>;
  }

  const initialValues = editInitialValues ?? createInitialValues;

  return (
    <section className="space-y-6" aria-labelledby="group-form-title">
      <header>
        <h1 id="group-form-title" className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Definí el grupo y su lista de participantes para usar en encuentros.
        </p>
      </header>

      <GroupForm
        initialValues={initialValues}
        isSaving={actions.isSaving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/groups")}
      />
    </section>
  );
}
