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

    const recognition = new SpeechRecognitionConstructor();
    recognitionRef.current = recognition;

    recognition.lang = "es-AR";
    recognition.continuous = true;
    recognition.interimResults = true;

    finalTranscriptRef.current = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result) continue;

        const transcript = result[0]?.transcript;

        if (transcript) {
          if (result.isFinal) {
            finalTranscriptRef.current += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
      }

      // Report interim results via callback
      if (interimTranscript || finalTranscriptRef.current) {
        options.onTranscript?.(finalTranscriptRef.current + interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);

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

      setState("error");
      options.onError?.("Error al transcribir el audio");
    };

    recognition.onend = () => {
      if (state === "transcribing") {
        setState("done");
        options.onTranscript?.(finalTranscriptRef.current);
      }
      recognitionRef.current = null;
    };

    setState("transcribing");
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
