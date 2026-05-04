import { type DataStatusCounts } from "@/features/home/services/data-status-service";

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function buildSummary(counts: DataStatusCounts): string {
  const parts: string[] = [];

  if (counts.projects > 0) {
    parts.push(pluralize(counts.projects, "proyecto", "proyectos"));
  }
  if (counts.encounters > 0) {
    parts.push(pluralize(counts.encounters, "encuentro", "encuentros"));
  }
  if (counts.observations > 0) {
    parts.push(pluralize(counts.observations, "observación", "observaciones"));
  }
  if (counts.chronicles > 0) {
    parts.push(pluralize(counts.chronicles, "crónica", "crónicas"));
  }
  if (counts.forms > 0) {
    parts.push(pluralize(counts.forms, "formulario", "formularios"));
  }
  if (counts.fields > 0) {
    parts.push(pluralize(counts.fields, "campo", "campos"));
  }

  return parts.join(" · ");
}

export const supportMessages = {
  title: "Soporte",
  subtitle: "Herramientas de diagnóstico y datos de prueba.",
} as const;

export const homeMessages = {
  welcomeTitle: "Bienvenido a Chronicle",
  welcomeSubtitle:
    "Documentá lo que pasó en cada encuentro y armá crónicas claras a partir de las observaciones que cargues.",
  quickCheck: {
    title: "Chequeo rápido del formulario",
    button: "Probar setup",
  },
  setupOkToast: "¡Listo! El setup está funcionando.",
  dataStatus: {
    title: "Estado de datos",
    loading: "Verificando si hay datos cargados…",
    empty: "Todavía no hay datos cargados.",
    populated: "Hay datos cargados.",
    summary: buildSummary,
  },
  demoEncounter: {
    titleEmpty: "Probar el flujo con un proyecto de prueba",
    descriptionEmpty:
      "Te creamos un proyecto con 13 participantes y 8 encuentros (jueves de 17 a 18:15). El primer encuentro viene con observaciones que cubren todos los tipos de campo y la crónica ya generada; los otros siete quedan vacíos para que practiques cargar lo tuyo.",
    titleLoaded: "Proyecto de prueba cargado",
    descriptionLoaded:
      "Ya tenés el proyecto con sus 13 participantes y los 8 encuentros listos para explorar, más las observaciones y la crónica del primero. Cuando quieras volver al estado inicial, eliminá el proyecto de prueba con un clic.",
  },
} as const;
