export type OnboardingIntroStep = {
  kind: "intro";
  title: string;
  description: string;
};

export type OnboardingTourStep = {
  kind: "hub-stop" | "tour" | "outro";
  title: string;
  description: string;
  /**
   * Target route. Supports `:demoProjectId`, `:demoEncounterId` and
   * `:demoChronicleId` placeholders that get resolved at navigation time
   * using the demo data the tutorial seeds at start.
   */
  route: string;
  /** `data-tour` attribute value of the element to highlight. */
  target?: string;
};

export type OnboardingStep = OnboardingIntroStep | OnboardingTourStep;

const introSteps: OnboardingIntroStep[] = [
  {
    kind: "intro",
    title: "Cómo funciona Chronicle",
    description:
      "Antes de cargar nada, mirá cómo encajan las distintas piezas: campos, formularios, proyectos, encuentros, observaciones y crónicas.",
  },
  {
    kind: "intro",
    title: "Cómo se guardan tus datos",
    description:
      "Es importante saber dónde queda lo que cargás y qué hacer para no perder trabajo: todo vive en este navegador.",
  },
  {
    kind: "intro",
    title: "Generación de crónicas con IA (opcional)",
    description:
      "Chronicle puede generar crónicas en prosa narrativa usando Gemini. Es gratis, opcional, y funciona con tu propia clave de API de Google.",
  },
];

const tourSteps: OnboardingTourStep[] = [
  // ─── CAMPOS ───────────────────────────────────────────────────────────
  {
    kind: "hub-stop",
    title: "Vamos a Campos",
    description:
      "Para que el recorrido tenga datos reales, ya creamos por vos un set de prueba completo. Vas a ver todo poblado a medida que avanzamos. Arrancamos por Campos: ese ícono iluminado del hub.",
    route: "/",
    target: "hub.fields",
  },
  {
    kind: "tour",
    title: "Campos: la lista",
    description:
      "Esta es la pantalla de campos. Acá ves todos los que ya tenés y podés filtrar entre activos y archivados. Los campos son los pedacitos de información que vas a capturar en cada observación: nota, puntaje, foto, audio, fecha, opciones, etc.",
    route: "/fields",
    target: "fields.list-region",
  },
  {
    kind: "tour",
    title: "Crear un campo",
    description:
      "Para sumar un campo nuevo tocás este botón. Vamos a entrar a verlo y describimos cada parte del formulario.",
    route: "/fields",
    target: "fields.new-button",
  },
  {
    kind: "tour",
    title: "Tipo del campo",
    description:
      "Lo primero que elegís es el tipo. Eso define cómo se va a comportar el campo en el formulario y qué configuración te pide debajo (opciones, mínimo/máximo, formato de fecha, etc.).",
    route: "/fields/new",
    target: "fields.type-selector",
  },
  {
    kind: "tour",
    title: "Nombre del campo",
    description:
      "Acá le ponés el nombre humano que vas a leer en los formularios y observaciones. Algo claro como “Nivel de participación” o “Foto del momento”.",
    route: "/fields/new",
    target: "fields.new.name-input",
  },
  {
    kind: "tour",
    title: "Guardar el campo",
    description:
      "Cuando completás los datos, lo guardás con este botón. Listo, el campo queda disponible para sumarlo a cualquier formulario.",
    route: "/fields/new",
    target: "fields.save-button",
  },

  // ─── FORMULARIOS ──────────────────────────────────────────────────────
  {
    kind: "hub-stop",
    title: "Ahora vamos a Formularios",
    description:
      "Volvemos al hub para entrar al siguiente flujo. El ícono iluminado ahora es el de Formularios.",
    route: "/",
    target: "hub.forms",
  },
  {
    kind: "tour",
    title: "Formularios",
    description:
      "Cada formulario es una plantilla de observación que combina campos en un orden fijo. Cuando editás un formulario se guarda como versión nueva, así las observaciones viejas siguen mostrando exactamente la versión que usaron.",
    route: "/forms",
    target: "forms.list-region",
  },
  {
    kind: "tour",
    title: "Crear un formulario",
    description: "Para armar uno nuevo tocás acá. Entremos a ver cómo se compone un formulario.",
    route: "/forms",
    target: "forms.new-button",
  },
  {
    kind: "tour",
    title: "Nombre del formulario",
    description:
      "Lo primero es ponerle un nombre que lo identifique fácil cuando cargues una observación: por ejemplo “Sesión grupal” o “Observación diaria”.",
    route: "/forms/new",
    target: "forms.new.name-input",
  },
  {
    kind: "tour",
    title: "Combinar campos",
    description:
      "Acá elegís qué campos forman parte del formulario y en qué orden van a aparecer durante la observación. A la izquierda los campos disponibles, a la derecha los seleccionados; podés subirlos, bajarlos o quitarlos.",
    route: "/forms/new",
    target: "forms.new.field-picker",
  },
  {
    kind: "tour",
    title: "Guardar formulario",
    description:
      "Cuando tenés el set de campos como querés, guardás con este botón. Si más adelante editás el formulario se va a guardar una versión nueva, sin pisar la que usan las observaciones viejas.",
    route: "/forms/new",
    target: "forms.new.save-button",
  },

  // ─── PROYECTOS ────────────────────────────────────────────────────────
  {
    kind: "hub-stop",
    title: "Seguimos con Proyectos",
    description:
      "Desde el hub, este es el ícono de Proyectos. Un proyecto agrupa a sus participantes y a los encuentros que tengan entre sí.",
    route: "/",
    target: "hub.projects",
  },
  {
    kind: "tour",
    title: "Proyectos",
    description:
      "Acá ves la lista de proyectos. Podés filtrar entre activos y archivados, y desde un proyecto vas a poder crear sus encuentros.",
    route: "/projects",
    target: "projects.list-region",
  },
  {
    kind: "tour",
    title: "Crear un proyecto",
    description: "Acá creás un proyecto nuevo. Entremos a ver el formulario.",
    route: "/projects",
    target: "projects.new-button",
  },
  {
    kind: "tour",
    title: "Nombre del proyecto",
    description:
      "Le ponés un nombre que identifique al proyecto: por ejemplo “Taller de música”, “Sala Azul” o el nombre del aula.",
    route: "/projects/new",
    target: "projects.new.name-input",
  },
  {
    kind: "tour",
    title: "Participantes del proyecto",
    description:
      "Acá sumás los participantes que forman parte del proyecto, uno por uno. Cuando cargues un encuentro vas a poder elegir cuáles de estos estuvieron presentes.",
    route: "/projects/new",
    target: "projects.new.participants",
  },
  {
    kind: "tour",
    title: "Guardar proyecto",
    description:
      "Cuando tenés el proyecto armado, lo guardás con este botón y queda listo para registrar encuentros.",
    route: "/projects/new",
    target: "projects.new.save-button",
  },

  // ─── DETALLE DE PROYECTO + CREACIÓN DE ENCUENTRO ──────────────────────
  {
    kind: "tour",
    title: "Detalle del proyecto",
    description:
      "Dentro del detalle de un proyecto ves su info, sus participantes y la lista de encuentros. Podés filtrar entre encuentros activos y archivados, y crear uno nuevo.",
    route: "/projects/:demoProjectId",
    target: "project.detail.header",
  },
  {
    kind: "tour",
    title: "Encuentros del proyecto",
    description:
      "Cada encuentro registra algo que ya pasó: una sesión, un taller, una clase. Para crear un encuentro nuevo dentro de este proyecto tocás este botón.",
    route: "/projects/:demoProjectId",
    target: "project.detail.new-encounter",
  },
  {
    kind: "tour",
    title: "Nombre del encuentro",
    description:
      "Cuando registrás un encuentro le ponés un nombre claro (por ejemplo “Sesión del lunes”), porque vas a tener varios dentro del mismo proyecto.",
    route: "/projects/:demoProjectId/encounters/new",
    target: "encounters.new.name-input",
  },
  {
    kind: "tour",
    title: "Fecha y hora",
    description:
      "Después indicás cuándo arrancó y cuándo terminó. Como Chronicle es para registrar lo que ya pasó, te conviene poner las horas reales del encuentro.",
    route: "/projects/:demoProjectId/encounters/new",
    target: "encounters.new.starts-at",
  },
  {
    kind: "tour",
    title: "Participantes del encuentro",
    description:
      "Marcás cuáles de los participantes del proyecto estuvieron presentes en este encuentro. Después podrás asignar observaciones a cualquiera de ellos.",
    route: "/projects/:demoProjectId/encounters/new",
    target: "encounters.new.participants",
  },

  // ─── DETALLE DE ENCUENTRO + OBSERVACIONES ─────────────────────────────
  {
    kind: "tour",
    title: "Información del encuentro",
    description:
      "Una vez creado el encuentro, arriba ves el resumen: nombre, proyecto al que pertenece, inicio y cierre, y los botones para archivar o ir a la crónica.",
    route: "/encounters/:demoEncounterId",
    target: "encounter.detail.header",
  },
  {
    kind: "tour",
    title: "Observaciones cargadas",
    description:
      "Más abajo está el listado de observaciones del encuentro, ordenadas por hora. En el de prueba ya cargamos dos para que veas cómo se ven.",
    route: "/encounters/:demoEncounterId",
    target: "encounter.detail.observations-list",
  },
  {
    kind: "tour",
    title: "Cargar una observación",
    description:
      "Cuando querés agregar una observación nueva, tocás este botón y se abre el formulario completo.",
    route: "/encounters/:demoEncounterId",
    target: "encounter.detail.new-observation",
  },
  {
    kind: "tour",
    title: "Elegí el formulario",
    description:
      "Lo primero al cargar una observación es elegir qué formulario querés usar. Podés mezclar formularios distintos dentro del mismo encuentro: usás el que mejor describa lo que viste cada vez.",
    route: "/encounters/:demoEncounterId/observations/new",
    target: "observations.new.form-selector",
  },
  {
    kind: "tour",
    title: "Completar la observación",
    description:
      "Una vez elegido el formulario aparecen sus campos: vas completando texto, número, opciones, fechas y archivos multimedia, y opcionalmente elegís a qué participante corresponde. Al guardar, la observación aparece en el listado.",
    route: "/encounters/:demoEncounterId/observations/new",
    target: "encounter.detail.observation-form",
  },
  {
    kind: "tour",
    title: "Ver la crónica del encuentro",
    description:
      "Desde el detalle del encuentro entrás a la crónica con este botón. Es la única puerta para generar y ver la crónica de un encuentro.",
    route: "/encounters/:demoEncounterId",
    target: "encounter.detail.view-chronicle",
  },
  {
    kind: "tour",
    title: "Generar la crónica",
    description:
      "En la página de la crónica del encuentro está el botón “Generar crónica”. Si tenés la clave de Gemini configurada sale en prosa narrativa; si no, sale como un resumen estructurado. Acá también podés regenerarla.",
    route: "/encounters/:demoEncounterId/chronicle",
    target: "encounter.chronicle.generate",
  },

  // ─── EXPORTAR/IMPORTAR (en Configuración) ────────────────────────────
  {
    kind: "hub-stop",
    title: "Ahora pasamos a Configuración",
    description:
      "Desde el hub, este es el ícono de Configuración. Ahí adentro vas a encontrar el color de la app, tu nombre, la opción para exportar e importar tus datos, y la clave de Gemini.",
    route: "/",
    target: "hub.settings",
  },
  {
    kind: "tour",
    title: "Exportar todos tus datos",
    description:
      "Con este botón generás un .zip con TODO lo que tenés cargado en este navegador: campos, formularios, proyectos, encuentros, observaciones, crónicas y archivos multimedia. Sirve como respaldo o para mover la información a otro navegador o dispositivo.",
    route: "/settings",
    target: "settings.export",
  },
  {
    kind: "tour",
    title: "Importar tus datos",
    description:
      "Si en otro dispositivo exportaste un .zip de Chronicle, lo soltás acá y reconstruimos todos los datos.",
    route: "/settings",
    target: "import.dropzone",
  },

  // ─── CRÓNICAS ─────────────────────────────────────────────────────────
  {
    kind: "hub-stop",
    title: "Y por último, Crónicas",
    description:
      "Este es el ícono de Crónicas. Acá están reunidas todas las crónicas que generaste a partir de los encuentros de cualquiera de tus proyectos.",
    route: "/",
    target: "hub.chronicles",
  },
  {
    kind: "tour",
    title: "Listado global de crónicas",
    description:
      "Acá ves la lista de todas las crónicas generadas. La crónica de prueba ya está en la lista — vamos a entrar a verla.",
    route: "/chronicles",
    target: "chronicles.list-region",
  },
  {
    kind: "tour",
    title: "El cuerpo de la crónica",
    description:
      "Esta es la crónica generada. Si tenías la clave de Gemini configurada, sale en prosa narrativa fluida. Si no, sale como un resumen estructurado de las observaciones.",
    route: "/chronicles/:demoChronicleId",
    target: "chronicle.detail.content",
  },
  {
    kind: "tour",
    title: "Compartir la crónica",
    description:
      "Con este botón podés compartir la crónica usando el menú nativo del dispositivo (WhatsApp, mail, etc.). Si tu navegador no soporta compartir, la copiamos al portapapeles para que la pegues donde quieras.",
    route: "/chronicles/:demoChronicleId",
    target: "chronicle.detail.share",
  },
  {
    kind: "tour",
    title: "Galería multimedia",
    description:
      "Y acá tenés todo el material multimedia capturado en el encuentro: fotos, videos y audios, ordenados por observación. Útil para revisar evidencias o compartir.",
    route: "/chronicles/:demoChronicleId",
    target: "chronicle.detail.media",
  },

  {
    kind: "outro",
    title: "Listo, ya conocés Chronicle",
    description:
      "Hiciste el recorrido completo: campos → formularios → proyectos → encuentros → observaciones → crónica. Cuando termines este tutorial, los datos de prueba que usamos se borran solos para que arranques con el navegador limpio. Antes de soltarte, te vamos a pedir un nombre para identificarte en los archivos que exportes.",
    route: "/",
  },
];

const allSteps: OnboardingStep[] = [...introSteps, ...tourSteps];

export const onboardingMessages = {
  introSteps,
  tourSteps,
  steps: allSteps,
  stepCounter: (current: number, total: number) => `Paso ${current} de ${total}`,
  previousButton: "Anterior",
  nextButton: "Siguiente",
  finishButton: "Empezar a usar Chronicle",
  skipButton: "Saltar tutorial",
  namePromptTitle: "¿Cómo te llamamos?",
  namePromptDescription:
    "Tu nombre aparece como autor en los archivos que exportes. No sale del navegador y lo podés cambiar cuando quieras desde Configuración.",
  namePromptHint:
    "Por defecto detectamos el navegador y el sistema que estás usando, pero podés escribir el que prefieras.",
  namePromptSaveButton: "Guardar y empezar",
  namePromptSkipButton: "Después lo configuro",
  namePromptInputLabel: "Nombre",
  namePromptInputPlaceholder: "Tu nombre",
  namePromptValidationError: "El nombre no puede estar vacío.",
  namePromptSaveSuccess: "Listo, te identificamos con ese nombre.",
} as const;
