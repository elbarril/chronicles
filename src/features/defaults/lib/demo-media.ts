/**
 * Tiny self-contained Blob factories used by the demo encounter seed.
 *
 * Goals:
 * - Stay fully offline / dependency-free.
 * - Produce real, decodable bytes for at least audio + image so the
 *   in-app players are exercisable end-to-end.
 * - Keep total payload negligible (~10 KB) so the demo can be safely
 *   embedded in the bundle.
 */

const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9H9LwAAAAASUVORK5CYII=";

// Minimal EBML/Matroska header. Enough to populate a video field and
// render the <video controls> UI; not guaranteed to decode to real frames.
// The user can swap any real recording in afterwards.
const PLACEHOLDER_WEBM_BASE64 = "GkXfo59ChoEBQveBAULygQRC84EIQvOBAELzgQhC84E=";

function base64ToBlob(base64: string, mime: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}

/**
 * Builds a 1x1 transparent PNG so the demo image field renders the
 * <img> element with valid bytes.
 */
export function buildTinyPngBlob(): Blob {
  return base64ToBlob(TINY_PNG_BASE64, "image/png");
}

/**
 * Builds a minimal WebM blob whose only purpose is to populate the
 * demo video field. The <video controls> element renders normally; the
 * user can replace it with a real recording from the file picker.
 */
export function buildPlaceholderWebmBlob(): Blob {
  return base64ToBlob(PLACEHOLDER_WEBM_BASE64, "video/webm");
}

/**
 * Builds a short silent WAV blob (PCM, mono, 8 kHz). Real, decodable,
 * playable bytes — the demo audio field actually plays without errors.
 */
export function buildSilentWavBlob(durationSeconds = 0.5, sampleRate = 8000): Blob {
  const numSamples = Math.max(1, Math.floor(durationSeconds * sampleRate));
  const dataSize = numSamples * 2;
  const totalSize = 44 + dataSize;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  function writeAscii(offset: number, text: string): void {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  }

  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true); // chunk size for PCM
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeAscii(36, "data");
  view.setUint32(40, dataSize, true);

  // Sample data already initialised to 0 (silent).
  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Builds a small plain-text file blob to populate the demo file field.
 * Provides a real downloadable resource for the file MediaItem.
 */
export function buildPlainTextFileBlob(): Blob {
  const content =
    "Archivo de prueba generado automáticamente para el encuentro demo de Chronicle.\n";

  return new Blob([content], { type: "text/plain" });
}
