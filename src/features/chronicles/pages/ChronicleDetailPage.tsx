import { Link, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { ChronicleMediaPanel } from "@/features/chronicles/components/ChronicleMediaPanel";
import { ChronicleViewer } from "@/features/chronicles/components/ChronicleViewer";
import { useChronicle } from "@/features/chronicles/hooks/use-chronicle";
import { useChronicleActions } from "@/features/chronicles/hooks/use-chronicle-actions";
import { chronicleMessages } from "@/features/chronicles/lib/messages";

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ChronicleDetailPage(): JSX.Element {
  const params = useParams();
  const navigate = useNavigate();
  const chronicleId = params.id ?? "";
  const { detail, isLoading } = useChronicle(chronicleId);
  const actions = useChronicleActions();

  if (!chronicleId) {
    return <p className="text-muted-foreground text-sm">{chronicleMessages.detailNotFound}</p>;
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Cargando crónica...</p>;
  }

  if (!detail) {
    return (
      <section className="space-y-3">
        <p className="text-muted-foreground text-sm">{chronicleMessages.detailNotFound}</p>
        <Button type="button" variant="secondary" onClick={() => navigate("/chronicles")}>
          {chronicleMessages.backToList}
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="chronicle-detail-title">
      <nav aria-label="Migas de pan">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/chronicles">← Volver a crónicas</Link>
        </Button>
      </nav>

      <header className="space-y-3">
        <h1 id="chronicle-detail-title" className="text-3xl font-bold tracking-tight break-words">
          {detail.chronicle.title}
        </h1>

        <dl className="text-muted-foreground grid gap-2 text-sm md:grid-cols-2">
          <div>
            <dt className="font-medium">{chronicleMessages.generatedAtLabel}</dt>
            <dd>{formatDate(detail.chronicle.generatedAt)}</dd>
          </div>
          <div>
            <dt className="font-medium">{chronicleMessages.encounterLabel}</dt>
            <dd>{detail.encounter?.activity ?? "No disponible"}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={actions.isGenerating || !detail.encounter}
            onClick={async () => {
              if (!detail.encounter) {
                return;
              }

              const next = await actions.regenerate(detail.encounter.id);
              navigate(`/chronicles/${next.id}`, { replace: true });
            }}
          >
            {actions.isGenerating
              ? chronicleMessages.regenerateLoadingButton
              : chronicleMessages.regenerateButton}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={actions.isDeleting}
            onClick={async () => {
              await actions.remove(detail.chronicle.id);
              navigate("/chronicles", { replace: true });
            }}
          >
            {chronicleMessages.deleteButton}
          </Button>
        </div>
      </header>

      <ChronicleViewer
        body={detail.chronicle.body}
        generatedWith={detail.chronicle.generatedWith}
      />

      {detail.encounter ? <ChronicleMediaPanel encounterId={detail.encounter.id} /> : null}
    </section>
  );
}
