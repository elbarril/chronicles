import { useCallback, useRef, useState } from "react";

// Type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export type TranscriberState = "idle" | "transcribing" | "done" | "error" | "unsupported";

interface UseAudioTranscriberOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
}

interface UseAudioTranscriberResult {
  state: TranscriberState;
  isTranscribing: boolean;
  start: () => void;
  stop: () => void;
  clear: () => void;
}

export function useAudioTranscriber(
  options: UseAudioTranscriberOptions = {},
): UseAudioTranscriberResult {
  const [state, setState] = useState<TranscriberState>("idle");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>("");

  const clear = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    finalTranscriptRef.current = "";
    setState("idle");
  }, []);

  const start = useCallback(() => {
    // Check for Web Speech API support
    if (
      typeof window === "undefined" ||
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      setState("unsupported");
      options.onError?.("Tu navegador no soporta transcripción de audio");
      return;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setState("unsupported");
      options.onError?.("Tu navegador no soporta transcripción de audio");
      return;
    }

    console.log("SpeechRecognition available, initializing...");

    const recognition = new SpeechRecognitionConstructor();
    recognitionRef.current = recognition;

    recognition.lang = "es-AR";
    recognition.continuous = true;
    recognition.interimResults = true;

    console.log("SpeechRecognition config:", {
      lang: recognition.lang,
      continuous: recognition.continuous,
      interimResults: recognition.interimResults,
    });

    finalTranscriptRef.current = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log("Speech recognition result received:", event.resultIndex, event.results.length);
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result) continue;

        const transcript = result[0]?.transcript;

        if (transcript) {
          if (result.isFinal) {
            finalTranscriptRef.current += transcript;
            console.log("Final transcript:", transcript);
          } else {
            interimTranscript += transcript;
            console.log("Interim transcript:", transcript);
          }
        }
      }

      // Report interim results via callback
      if (interimTranscript || finalTranscriptRef.current) {
        options.onTranscript?.(finalTranscriptRef.current + interimTranscript);
      }
    };

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error, event.message);

      if (event.error === "not-allowed") {
        setState("error");
        options.onError?.("Permiso de micrófono denegado");
        return;
      }

      if (event.error === "no-speech") {
        // No speech detected, but this isn't necessarily an error
        setState("done");
        options.onTranscript?.(finalTranscriptRef.current);
        return;
      }

      if (event.error === "network") {
        setState("error");
        options.onError?.("Error de red en la transcripción");
        return;
      }

      if (event.error === "aborted") {
        setState("done");
        return;
      }

      setState("error");
      options.onError?.(`Error al transcribir: ${event.error}`);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      if (state === "transcribing") {
        setState("done");
        options.onTranscript?.(finalTranscriptRef.current);
      }
      recognitionRef.current = null;
    };

    setState("transcribing");
    console.log("Starting speech recognition...");
    void recognition.start();
  }, [options, state]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setState("done");
  }, []);

  return {
    state,
    isTranscribing: state === "transcribing",
    start,
    stop,
    clear,
  };
}
