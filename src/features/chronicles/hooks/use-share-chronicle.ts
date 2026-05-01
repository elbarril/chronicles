import { useState } from "react";
import { toast } from "sonner";

import { chronicleMessages } from "@/features/chronicles/lib/messages";

interface ShareChroniclePayload {
  title: string;
  body: string;
}

function hasWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function useShareChronicle() {
  const [isSharing, setIsSharing] = useState(false);

  async function share({ title, body }: ShareChroniclePayload): Promise<void> {
    setIsSharing(true);
    const fullText = `${title}\n\n${body}`;

    try {
      if (hasWebShare()) {
        try {
          await navigator.share({ title, text: fullText });
          // Some browsers report a "successful" share even if the user
          // cancels; we still consider it handled and don't fall back.
          return;
        } catch (error) {
          // AbortError is fired when the user cancels the native share
          // sheet — we don't want to fall back to clipboard in that case.
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          // Any other error (e.g. NotAllowedError on insecure contexts)
          // means we should fall back to the clipboard path.
        }
      }

      const copied = await copyToClipboard(fullText);
      if (copied) {
        toast.success(chronicleMessages.shareCopiedFallback);
      } else {
        toast.error(chronicleMessages.shareUnavailable);
      }
    } finally {
      setIsSharing(false);
    }
  }

  return { share, isSharing };
}
