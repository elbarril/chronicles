import { useCallback, useRef, useState } from "react";

export type AudioRecorderState = "idle" | "recording" | "stopped" | "denied" | "unsupported";

interface UseAudioRecorderOptions {
  onStop?: (blob: Blob, mimeType: string) => void;
}

interface UseAudioRecorderResult {
  state: AudioRecorderState;
  isRecording: boolean;
  start: () => Promise<void>;
  stop: () => void;
  clear: () => void;
}

const FALLBACK_MIME_TYPE = "audio/webm";

export function useAudioRecorder(options: UseAudioRecorderOptions = {}): UseAudioRecorderResult {
  const [state, setState] = useState<AudioRecorderState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const clear = useCallback(() => {
    chunksRef.current = [];

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
    setState("idle");
  }, []);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state !== "recording") {
      return;
    }

    recorder.stop();
  }, []);

  const start = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setState("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setState("denied");
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || FALLBACK_MIME_TYPE;
        const blob = new Blob(chunksRef.current, { type: mimeType });

        setState("stopped");
        options.onStop?.(blob, mimeType);

        if (streamRef.current) {
          for (const track of streamRef.current.getTracks()) {
            track.stop();
          }
          streamRef.current = null;
        }

        mediaRecorderRef.current = null;
      };

      recorder.start();
      setState("recording");
    } catch {
      setState("denied");
    }
  }, [options]);

  return {
    state,
    isRecording: state === "recording",
    start,
    stop,
    clear,
  };
}
