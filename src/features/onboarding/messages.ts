export const onboardingMessages = {
  steps: [
    {
      title: "Cómo funciona Chronicle",
      description:
        "Antes de cargar nada, mirá cómo encajan las distintas piezas: campos, formularios, grupos, encuentros, observaciones y crónicas.",
    },
    {
      title: "Cómo se guardan tus datos",
      description:
        "Es importante saber dónde queda lo que cargás y qué hacer para no perder trabajo: todo vive en este navegador.",
    },
    {
      title: "Generación de crónicas con IA (opcional)",
      description:
        "Chronicle puede generar crónicas en prosa narrativa usando Gemini. Es gratis, opcional, y funciona con tu propia clave de API de Google.",
    },
  ],
  stepCounter: (current: number, total: number) => `Paso ${current} de ${total}`,
  previousButton: "Anterior",
  nextButton: "Siguiente",
  finishButton: "Empezar a usar Chronicle",
  skipButton: "Saltar tutorial",
} as const;
