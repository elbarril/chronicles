import { type DataStatusCounts } from "@/features/home/services/data-status-service";

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function buildSummary(counts: DataStatusCounts): string {
  const parts: string[] = [];

  if (counts.groups > 0) {
    parts.push(pluralize(counts.groups, "grupo", "grupos"));
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

export const homeMessages = {
  welcomeTitle: "Bienvenido a Chronicle",
  welcomeSubtitle:
    "Ya vamos a arrancar con las observaciones en tiempo real para armar crónicas claras.",
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
    titleEmpty: "Probar el flujo con un encuentro de prueba",
    descriptionEmpty:
      "Te creamos un grupo, dos participantes, un encuentro con una observación que cubre todos los tipos de campo y la crónica ya generada. Sirve para recorrer el flujo completo sin completar nada a mano.",
    titleLoaded: "Contenido de prueba cargado",
    descriptionLoaded:
      "Tenés el encuentro, observación y crónica de prueba listos para explorar. Cuando quieras volver al estado inicial, eliminá todo el contenido de prueba con un clic.",
  },
} as const;
