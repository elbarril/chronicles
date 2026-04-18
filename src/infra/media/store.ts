import { db } from "@/infra/db/client";

interface MediaRecord {
  id: string;
  mime: string;
  blob: Blob;
  size: number;
  createdAt: string;
}

interface ObjectUrlHandle {
  url: string;
  revoke: () => void;
}

function nowIsoString(): string {
  return new Date().toISOString();
}

const objectUrlRegistry = new Set<string>();

export async function saveMediaBlob(blob: Blob, mime?: string): Promise<string> {
  const mediaId = crypto.randomUUID();

  const record: MediaRecord = {
    id: mediaId,
    mime: mime ?? blob.type ?? "application/octet-stream",
    blob,
    size: blob.size,
    createdAt: nowIsoString(),
  };

  await db.media.add(record);

  return mediaId;
}

export async function getMediaBlob(mediaId: string): Promise<Blob | undefined> {
  const media = await db.media.get(mediaId);

  return media?.blob;
}

export async function deleteMediaBlob(mediaId: string): Promise<boolean> {
  const media = await db.media.get(mediaId);

  if (!media) {
    return false;
  }

  await db.media.delete(mediaId);

  return true;
}

export async function createMediaObjectUrl(mediaId: string): Promise<ObjectUrlHandle | null> {
  const blob = await getMediaBlob(mediaId);

  if (!blob) {
    return null;
  }

  const url = URL.createObjectURL(blob);
  objectUrlRegistry.add(url);

  return {
    url,
    revoke: () => {
      URL.revokeObjectURL(url);
      objectUrlRegistry.delete(url);
    },
  };
}

export function revokeAllMediaObjectUrls(): void {
  for (const url of objectUrlRegistry) {
    URL.revokeObjectURL(url);
    objectUrlRegistry.delete(url);
  }
}
