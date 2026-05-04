import { Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ChronicleMediaPanel } from "@/features/chronicles/components/ChronicleMediaPanel";
import { ChronicleViewer } from "@/features/chronicles/components/ChronicleViewer";
import { useChronicleActions } from "@/features/chronicles/hooks/use-chronicle-actions";
import { useChronicleByEncounter } from "@/features/chronicles/hooks/use-chronicle-by-encounter";
import { useShareChronicle } from "@/features/chronicles/hooks/use-share-chronicle";
import { chronicleMessages } from "@/features/chronicles/lib/messages";
import { useEncounter } from "@/features/encounters/hooks/use-encounter";
import { AiKeyStatusBadge } from "@/features/settings/components/AiKeyStatusBadge";

export function EncounterChroniclePage(): JSX.Element {
  const params = useParams();
  const navigate = useNavigate();
  const encounterId = params.id ?? "";

  const { encounter, project, isLoading: isEncounterLoading } = useEncounter(encounterId);
  const { chronicle, isLoading: isChronicleLoading } = useChronicleByEncounter(encounterId);
  const actions = useChronicleActions();
  const shareAction = useShareChronicle();

  const isLoading = isEncounterLoading || isChronicleLoading;

  if (!encounterId) {
    return <p className="text-muted-foreground text-sm">Encuentro inválido.</p>;
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Cargando crónica del encuentro...</p>;
  }

  if (!encounter) {
    return (
      <section className="space-y-3" aria-labelledby="encounter-chronicle-missing-title">
        <h1 id="encounter-chronicle-missing-title" className="text-3xl font-bold tracking-tight">
          Encuentro no encontrado
        </h1>
        <Button type="button" variant="secondary" onClick={() => navigate("/projects")}>
          Volver a proyectos
        </Button>
      </section>
    );
  }

  async function handleGenerate(): Promise<void> {
    await actions.generate(encounter!.id);
  }

  async function handleRemove(): Promise<void> {
    if (!chronicle) {
      return;
    }
    await actions.remove(chronicle.id);
  }

  return (
    <section className="space-y-6" aria-labelledby="encounter-chronicle-title">
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/" },
          { label: "Proyectos", to: "/projects" },
          project ? { label: project.name, to: `/projects/${project.id}` } : { label: "Proyecto" },
          { label: encounter.name, to: `/encounters/${encounter.id}` },
          { label: "Crónica" },
        ]}
      />

      <header className="space-y-2">
        <h1 id="encounter-chronicle-title" className="text-3xl font-bold tracking-tight">
          Crónica del encuentro
        </h1>
        <p className="text-muted-foreground text-sm">
          {project?.name ?? "Proyecto"} · {encounter.name}
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="sm:mr-auto">
          <AiKeyStatusBadge />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={actions.isGenerating}
          onClick={() => {
            void handleGenerate();
          }}
          data-tour="encounter.chronicle.generate"
        >
          {actions.isGenerating
            ? chronicle
              ? chronicleMessages.regenerateLoadingButton
              : chronicleMessages.generatingButton
            : chronicle
              ? chronicleMessages.regenerateButton
              : chronicleMessages.generateButton}
        </Button>

        {chronicle ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={shareAction.isSharing}
              onClick={() => {
                void shareAction.share({
                  title: chronicle.title,
                  body: chronicle.body,
                });
              }}
              data-tour="chronicle.detail.share"
            >
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
              {shareAction.isSharing
                ? chronicleMessages.sharingButton
                : chronicleMessages.shareButton}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={actions.isDeleting}
              onClick={() => {
                void handleRemove();
              }}
            >
              {chronicleMessages.deleteButton}
            </Button>
          </>
        ) : null}
      </div>

      {chronicle ? (
        <>
          <div data-tour="chronicle.detail.content">
            <ChronicleViewer body={chronicle.body} generatedWith={chronicle.generatedWith} />
          </div>

          <div data-tour="chronicle.detail.media">
            <ChronicleMediaPanel encounterId={encounter.id} />
          </div>
        </>
      ) : (
        <section
          className="bg-muted/40 rounded-3xl p-6 text-center"
          aria-live="polite"
          data-tour="encounter.chronicle.empty"
        >
          <h2 className="text-lg font-semibold">
            {chronicleMessages.emptyEncounterChronicleTitle}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {chronicleMessages.emptyEncounterChronicleDescription}
          </p>
        </section>
      )}
    </section>
  );
}
