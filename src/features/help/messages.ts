export const dataStoragePage = {
  pageTitle: "Cómo se guardan tus datos",
  pageDescription:
    "Antes de arrancar a observar, leé esto: Chronicle guarda todo en tu propio dispositivo. Conocer cómo funciona te evita perder información sin querer.",
} as const;

export const dataStorageGuide = {
  storageSection: {
    title: "Tus datos viven en este navegador",
    intro:
      "Chronicle no usa una nube ni una cuenta. Todo lo que cargás (campos, formularios, grupos, encuentros, observaciones, fotos, audios, videos y crónicas) se guarda únicamente acá, en el navegador de este dispositivo.",
    points: [
      "No se sincroniza solo entre dispositivos: lo que cargás en la compu no aparece en el celular, y viceversa.",
      "Cada navegador tiene su propio espacio: si abrís Chronicle en Chrome y después en Firefox, son dos bases distintas.",
      "Funciona sin internet: una vez abierta la app, podés seguir trabajando aunque te quedes sin conexión.",
      "Los archivos multimedia (imágenes, videos, audios) también se guardan en este navegador, así que ocupan lugar en tu dispositivo.",
    ],
  },
  riskSection: {
    title: "Cuándo podés perder los datos",
    intro:
      "Como todo vive en el navegador, hay acciones cotidianas que pueden borrar la información sin aviso. Tenelo presente:",
    points: [
      "Si borrás los datos del navegador (historial, caché, cookies, datos de sitios) podés borrar también todo lo cargado en Chronicle.",
      "Las ventanas de incógnito o privadas no son aptas para Chronicle: lo que cargues ahí se pierde al cerrarlas.",
      "Si desinstalás el navegador, se reinicia el dispositivo de fábrica o se daña el disco, los datos se van con él.",
      "Si el navegador se queda sin espacio o el sistema decide liberar lugar, puede limpiar los datos del sitio.",
      "Cambiar de dispositivo o de navegador es como empezar de cero: los datos no viajan solos.",
    ],
  },
  backupSection: {
    title: "Cómo cuidar tu trabajo",
    intro:
      "La forma más segura de no perder un encuentro importante es exportarlo y guardar ese archivo en un lugar confiable.",
    points: [
      "Desde el detalle de cada encuentro podés exportar un archivo .zip que incluye todas las observaciones y los archivos multimedia asociados.",
      "Guardá esos .zip en un lugar seguro: una carpeta en la nube, un pendrive, o tu disco.",
      "Para mover un encuentro a otro dispositivo o navegador, importá ese mismo .zip desde la sección Importar.",
      "Si volvés a importar un .zip que ya estaba cargado, se actualizan los datos existentes en lugar de duplicarse.",
      "Hacé exportaciones periódicas, sobre todo antes de limpiar el navegador, cambiar de equipo o trabajar con muchas fotos y videos.",
    ],
    encountersLink: "Ir a encuentros",
    importLink: "Ir a importar",
  },
  recommendationsSection: {
    title: "Recomendaciones para el día a día",
    points: [
      "Usá siempre el mismo navegador en el mismo dispositivo para seguir un mismo ciclo de trabajo.",
      "Evitá modo incógnito o privado para tareas reales: dejalo solo para probar.",
      "Si tenés muchas fotos o videos, controlá el espacio libre del dispositivo: si se llena, el navegador puede empezar a fallar al guardar.",
      "Si vas a prestar la compu o el celular, exportá tus encuentros antes para tener una copia.",
      "Si instalás Chronicle como aplicación (PWA), los datos siguen viviendo en el navegador desde el cual la instalaste.",
    ],
  },
  privacySection: {
    title: "Privacidad",
    intro:
      "Como nada se sube a un servidor, tus observaciones quedan solo en tu dispositivo. Eso también significa que sos el responsable de cuidarlas: lo que no exportás, no se recupera desde otro lado.",
  },
} as const;

export const howItWorksPage = {
  pageTitle: "Cómo funciona Chronicle",
  pageDescription:
    "Una recorrida rápida por la lógica de la app: para qué sirve, qué pasos seguís y cómo encajan las distintas secciones.",
} as const;

type WorkflowStep = {
  title: string;
  description: string;
  cta?: { label: string; to: string };
};

const workflowSteps: readonly WorkflowStep[] = [
  {
    title: "1. Definí los campos",
    description:
      "Los campos son los datos que querés capturar: una nota corta, un puntaje, una foto, un audio, una fecha, una elección. Los creás una vez y los reutilizás en distintos formularios.",
    cta: { label: "Ir a campos", to: "/fields" },
  },
  {
    title: "2. Armá un formulario de observación",
    description:
      "Un formulario es un conjunto ordenado de campos. Es la plantilla que vas a completar mientras observás. Si más adelante editás el formulario, se guarda una nueva versión: los encuentros viejos siguen mostrando la versión que usaron.",
    cta: { label: "Ir a formularios", to: "/forms" },
  },
  {
    title: "3. Cargá grupos y participantes",
    description:
      "Un grupo agrupa a las personas que vas a observar juntas. Sumá a los participantes que correspondan. Después vas a poder asignar observaciones a un participante en particular o al grupo entero.",
    cta: { label: "Ir a grupos", to: "/groups" },
  },
  {
    title: "4. Iniciá un encuentro",
    description:
      "El encuentro es la sesión concreta de observación: elegís un grupo, una actividad y un formulario. Mientras está abierto vas cargando observaciones; cuando terminás lo finalizás y queda como registro cerrado.",
    cta: { label: "Ir a encuentros", to: "/encounters" },
  },
  {
    title: "5. Capturá observaciones",
    description:
      "Dentro del encuentro completás el formulario las veces que quieras. Cada observación puede llevar texto, números, elecciones, fechas y archivos multimedia: fotos, videos y audios grabados desde el mismo navegador.",
  },
  {
    title: "6. Generá la crónica",
    description:
      "Cuando tenés observaciones cargadas, podés generar una crónica desde el detalle del encuentro. Es un texto narrativo que ordena todo lo que registraste para que puedas leerlo o compartirlo.",
    cta: { label: "Ir a crónicas", to: "/chronicles" },
  },
];

export const howItWorksGuide = {
  intro: {
    title: "Para qué sirve Chronicle",
    description:
      "Chronicle te ayuda a observar a un grupo realizando una actividad en una institución y a transformar esas observaciones en una crónica clara.",
    points: [
      "Está pensado para usar en el momento, mientras observás, sin trabarte con la herramienta.",
      "Funciona desde el navegador, también sin conexión: ideal para situaciones reales en aulas, talleres, prácticas o salidas.",
      "Cada concepto (campo, formulario, grupo, encuentro, observación, crónica) tiene una función concreta dentro del flujo.",
    ],
  },
  workflow: {
    title: "El flujo en 6 pasos",
    description: "Esta es la secuencia natural para empezar y dejar todo configurado.",
    steps: workflowSteps,
  },
  share: {
    title: "Compartir y mover encuentros",
    description:
      "Como Chronicle no usa una nube, para mover un encuentro entre dispositivos o personas usás archivos .zip.",
    points: [
      "Desde un encuentro podés exportar un .zip que incluye sus observaciones y archivos multimedia.",
      "En la sección Importar cargás ese .zip en otro navegador o dispositivo y lo recuperás tal cual.",
      "Si importás un encuentro que ya existía, se actualiza en lugar de duplicarse.",
    ],
    importLink: { label: "Ir a importar", to: "/import" },
  },
  offline: {
    title: "Funciona sin internet",
    description:
      "Una vez abierta, la app sigue andando aunque te quedes sin conexión: podés seguir cargando observaciones, sacar fotos, grabar audios y generar crónicas. Todo se guarda en este mismo navegador.",
  },
  nextStep: {
    title: "Antes de arrancar",
    description:
      "Como todo se guarda en tu dispositivo, te conviene leer también cómo funciona el guardado de datos para no perder trabajo importante.",
    cta: { label: "Cómo se guardan tus datos", to: "/help" },
  },
} as const;
