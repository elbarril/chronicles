import { useEffect, useState } from "react";

import { createMediaObjectUrl } from "@/infra/media/store";

/**
 * Resolves a stored `mediaId` to an object URL with managed lifecycle:
 * the URL is revoked automatically when the `mediaId` changes or the
 * component unmounts. Returns `undefined` while loading or when the
 * media row no longer exists.
 *
 * The synchronous `setUrl(undefined)` on cleanup ensures that we never
 * render a revoked URL into a media element, which would otherwise
 * point at an unreachable resource.
 */
export function useMediaObjectUrl(mediaId: string | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!mediaId) {
      return;
    }

    let cancelled = false;
    let revoke: (() => void) | undefined;

    void createMediaObjectUrl(mediaId).then((handle) => {
      if (!handle) {
        return;
      }

      if (cancelled) {
        handle.revoke();
        return;
      }

      revoke = handle.revoke;
      setUrl(handle.url);
    });

    return () => {
      cancelled = true;
      revoke?.();
      setUrl(undefined);
    };
  }, [mediaId]);

  return url;
}

/**
 * Wraps an in-memory `Blob` (e.g. a freshly recorded audio chunk or a
 * file picked from disk) with an object URL whose lifecycle follows the
 * caller component. The URL is revoked automatically whenever the blob
 * changes or the component unmounts.
 */
export function useBlobObjectUrl(blob: Blob | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!blob) {
      return;
    }

    const next = URL.createObjectURL(blob);
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- Expose the
       Object URL produced by this side-effect through state. */
    setUrl(next);

    return () => {
      URL.revokeObjectURL(next);
      setUrl(undefined);
    };
  }, [blob]);

  return url;
}
