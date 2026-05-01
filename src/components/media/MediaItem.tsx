/* eslint-disable jsx-a11y/media-has-caption -- User-recorded audio/video
   attached to an observation. Captions are not produced by the app. */
import { useMediaObjectUrl } from "@/infra/media/use-media-object-url";

export type MediaKind = "audio" | "video" | "image" | "file";

interface MediaItemProps {
  mediaId: string;
  kind: MediaKind;
  label?: string;
  fileName?: string;
}

/**
 * Renders a saved media row by `mediaId` using the appropriate native
 * player/preview for its `kind`. Resolves the underlying blob to an
 * object URL with managed lifecycle.
 */
export function MediaItem({ mediaId, kind, label, fileName }: MediaItemProps): JSX.Element {
  const url = useMediaObjectUrl(mediaId);
  const altText = label ?? fileName ?? "Adjunto";
  const downloadName = fileName ?? "archivo";

  if (!url) {
    return (
      <p
        className="text-muted-foreground text-xs"
        role="status"
        aria-live="polite"
        aria-label={`Cargando ${altText}`}
      >
        Cargando archivo…
      </p>
    );
  }

  switch (kind) {
    case "audio":
      return (
        <audio
          controls
          preload="metadata"
          src={url}
          aria-label={`Reproducir ${altText}`}
          className="w-full"
        />
      );
    case "video":
      return (
        <video
          controls
          preload="metadata"
          src={url}
          aria-label={`Reproducir ${altText}`}
          className="border-border max-h-80 w-full rounded-md border"
        />
      );
    case "image":
      return (
        <img
          src={url}
          alt={altText}
          className="border-border max-h-80 rounded-md border object-contain"
        />
      );
    case "file":
      return (
        <a
          href={url}
          download={downloadName}
          className="text-primary inline-flex items-center text-sm underline"
          aria-label={`Descargar ${altText}`}
        >
          Descargar archivo
        </a>
      );
  }
}
