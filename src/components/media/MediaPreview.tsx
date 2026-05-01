/* eslint-disable jsx-a11y/media-has-caption -- Live preview of a user-recorded
   audio/video Blob. Captions are not produced by the app. */
import { type MediaKind } from "@/components/media/MediaItem";
import { useBlobObjectUrl } from "@/infra/media/use-media-object-url";

interface MediaPreviewProps {
  blob: Blob;
  kind: MediaKind;
  label?: string;
}

/**
 * Previews an in-memory `Blob` (e.g. a freshly recorded audio chunk
 * or a file picked from disk before it is persisted). Mirrors the
 * native player/preview chosen by `<MediaItem>` for each kind.
 */
export function MediaPreview({ blob, kind, label }: MediaPreviewProps): JSX.Element | null {
  const url = useBlobObjectUrl(blob);
  const altText = label ?? "Vista previa del adjunto";
  const fileName = blob instanceof File ? blob.name : undefined;
  const downloadName = fileName ?? "archivo";

  if (!url) {
    return null;
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
          {fileName ?? "Descargar archivo"}
        </a>
      );
  }
}
