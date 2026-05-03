import { Share2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { ChronicleMediaPanel } from "@/features/chronicles/components/ChronicleMediaPanel";
import { ChronicleViewer } from "@/features/chronicles/components/ChronicleViewer";
import { useChronicle } from "@/features/chronicles/hooks/use-chronicle";
import { useChronicleActions } from "@/features/chronicles/hooks/use-chronicle-actions";
import { useShareChronicle } from "@/features/chronicles/hooks/use-share-chronicle";
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
  const shareAction = useShareChronicle();

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
            <dd>{detail.encounter?.name ?? "No disponible"}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {detail.encounter ? (
            <Button
              asChild
              variant="outline"
              className="w-full sm:mr-auto sm:w-auto"
              data-tour="chronicle.detail.go-to-encounter"
            >
              <Link to={`/encounters/${detail.encounter.id}/chronicle`}>
                {chronicleMessages.regenerateButton}
              </Link>
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={shareAction.isSharing}
            onClick={() => {
              void shareAction.share({
                title: detail.chronicle.title,
                body: detail.chronicle.body,
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
            onClick={async () => {
              await actions.remove(detail.chronicle.id);
              navigate("/chronicles", { replace: true });
            }}
          >
            {chronicleMessages.deleteButton}
          </Button>
        </div>
      </header>

      <div data-tour="chronicle.detail.content">
        <ChronicleViewer
          body={detail.chronicle.body}
          generatedWith={detail.chronicle.generatedWith}
        />
      </div>

      {detail.encounter ? (
        <div data-tour="chronicle.detail.media">
          <ChronicleMediaPanel encounterId={detail.encounter.id} />
        </div>
      ) : null}
    </section>
  );
}
