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
   * Target route. Supports `:demoEncounterId` and `:demoChronicleId`
   * placeholders that get resolved at navigation time using the demo
   * data the tutorial seeds at start.
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
      "Antes de cargar nada, mirá cómo encajan las distintas piezas: campos, formularios, grupos, encuentros, observaciones y crónicas.",
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
      "Lo primero que elegís es el tipo. Eso define cómo se va a comportar el campo en el encuentro y qué configuración te pide debajo (opciones, mínimo/máximo, formato de fecha, etc.).",
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
      "Cada formulario es una plantilla de observación que combina campos en un orden fijo. Cuando editás un formulario se guarda como versión nueva, así los encuentros viejos siguen mostrando exactamente la versión que usaron.",
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
      "Lo primero es ponerle un nombre que lo identifique fácil cuando empieces un encuentro: por ejemplo “Sesión grupal” o “Observación diaria”.",
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
      "Cuando tenés el set de campos como querés, guardás con este botón. Si más adelante editás el formulario se va a guardar una versión nueva, sin pisar la que usan los encuentros viejos.",
    route: "/forms/new",
    target: "forms.new.save-button",
  },

  // ─── GRUPOS ───────────────────────────────────────────────────────────
  {
    kind: "hub-stop",
    title: "Seguimos con Grupos",
    description: "Desde el hub, este es el ícono de Grupos.",
    route: "/",
    target: "hub.groups",
  },
  {
    kind: "tour",
    title: "Grupos",
    description:
      "Los grupos juntan a las personas que vas a observar. Cada grupo tiene sus participantes y después podés asignar observaciones al grupo entero o a alguien en particular.",
    route: "/groups",
    target: "groups.list-region",
  },
  {
    kind: "tour",
    title: "Crear un grupo",
    description: "Acá creás un grupo nuevo. Entremos a ver el formulario.",
    route: "/groups",
    target: "groups.new-button",
  },
  {
    kind: "tour",
    title: "Nombre del grupo",
    description:
      "Le ponés un nombre que identifique al grupo: por ejemplo “Sala Azul”, “Equipo de la mañana” o el nombre del aula.",
    route: "/groups/new",
    target: "groups.new.name-input",
  },
  {
    kind: "tour",
    title: "Participantes",
    description:
      "Acá sumás los participantes del grupo, uno por uno. Cada uno se va a poder elegir después en cada observación, o podés dejarla asociada al grupo entero.",
    route: "/groups/new",
    target: "groups.new.participants",
  },
  {
    kind: "tour",
    title: "Guardar grupo",
    description:
      "Cuando tenés el grupo armado, lo guardás con este botón y queda listo para usar en un encuentro.",
    route: "/groups/new",
    target: "groups.new.save-button",
  },

  // ─── ENCUENTROS ───────────────────────────────────────────────────────
  {
    kind: "hub-stop",
    title: "Pasamos a Encuentros",
    description:
      "Este es el ícono de Encuentros. Es el flujo más usado del día a día, donde vas cargando observaciones en tiempo real.",
    route: "/",
    target: "hub.encounters",
  },
  {
    kind: "tour",
    title: "Encuentros: filtros",
    description:
      "Los encuentros son las sesiones de observación en tiempo real. Filtrás según estén en curso, finalizados o archivados para no mezclar el trabajo del día con lo viejo.",
    route: "/encounters",
    target: "encounters.filter-bar",
  },
  {
    kind: "tour",
    title: "Iniciar un encuentro",
    description: "Para arrancar un encuentro nuevo tocás acá. Veamos qué te pide el formulario.",
    route: "/encounters",
    target: "encounters.new-button",
  },
  {
    kind: "tour",
    title: "Elegí el grupo",
    description:
      "Lo primero es elegir el grupo que vas a observar, de los que ya creaste en la sección Grupos.",
    route: "/encounters/new",
    target: "encounters.new.group-selector",
  },
  {
    kind: "tour",
    title: "Elegí el formulario",
    description:
      "Después elegís el formulario con el que vas a cargar las observaciones. Acá Chronicle toma una foto (snapshot) de la versión actual del formulario, así si la editás más adelante, este encuentro sigue usando lo que vio originalmente.",
    route: "/encounters/new",
    target: "encounters.new.form-selector",
  },
  {
    kind: "tour",
    title: "Iniciar el encuentro",
    description:
      "Tocás “Crear encuentro” y arranca la sesión. A partir de ahí ya podés cargar observaciones en tiempo real.",
    route: "/encounters/new",
    target: "encounters.new.start-button",
  },
  {
    kind: "tour",
    title: "Información del encuentro",
    description:
      "Arriba de todo tenés el resumen del encuentro: la actividad, el formulario y la versión que está usando, cuándo arrancó, si ya finalizó, cuántos participantes están asociados, y los botones de acción (generar crónica, exportar, finalizar y archivar).",
    route: "/encounters/:demoEncounterId",
    target: "encounter.detail.header",
  },
  {
    kind: "tour",
    title: "Timeline del encuentro",
    description:
      "Más abajo está el timeline con todas las observaciones que cargaste, ordenadas por hora. En el de prueba ya hay una observación para que veas cómo se ve.",
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
    title: "Formulario de observación",
    description:
      "Este es el formulario que armaste antes. Vas completando cada campo (texto, número, foto, audio, etc.) y opcionalmente elegís a qué participante corresponde. Al guardar, la observación aparece en el timeline.",
    route: "/encounters/:demoEncounterId/observations/new",
    target: "encounter.detail.observation-form",
  },
  {
    kind: "tour",
    title: "Generar la crónica",
    description:
      "En cualquier momento podés generar una crónica a partir de las observaciones cargadas. Si tenés la clave de Gemini configurada, sale en prosa narrativa; si no, sale como un resumen estructurado.",
    route: "/encounters/:demoEncounterId",
    target: "encounter.detail.generate-chronicle",
  },
  {
    kind: "tour",
    title: "Finalizar el encuentro",
    description:
      "Cuando terminás la observación tocás este botón. Una vez finalizado, el encuentro queda archivado en su versión final y la crónica generada conserva ese contexto.",
    route: "/encounters/:demoEncounterId",
    target: "encounter.detail.finalize",
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
      "Con este botón generás un .zip con TODO lo que tenés cargado en este navegador: campos, formularios, grupos, encuentros, observaciones, crónicas y archivos multimedia. Sirve como respaldo o para mover la información a otro navegador o dispositivo. Funciona siempre, aunque todavía no tengas encuentros o crónicas.",
    route: "/settings",
    target: "settings.export",
  },
  {
    kind: "tour",
    title: "Importar tus datos",
    description:
      "Si en otro dispositivo exportaste un .zip de Chronicle, lo soltás acá y reconstruimos todos los datos. Reconoce tanto las exportaciones globales nuevas como las de encuentros individuales generadas con versiones anteriores de Chronicle.",
    route: "/settings",
    target: "import.dropzone",
  },

  // ─── CRÓNICAS ─────────────────────────────────────────────────────────
  {
    kind: "hub-stop",
    title: "Y por último, Crónicas",
    description:
      "Este es el ícono de Crónicas. Acá termina el flujo: lo que generás a partir de tus encuentros.",
    route: "/",
    target: "hub.chronicles",
  },
  {
    kind: "tour",
    title: "Crónicas",
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
    title: "Regenerar la crónica",
    description:
      "Si querés volver a generar la crónica con otro tono o porque agregaste observaciones, usás este botón. Cada generación queda como versión nueva.",
    route: "/chronicles/:demoChronicleId",
    target: "chronicle.detail.regenerate",
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
      "Hiciste el recorrido completo: campos → formularios → grupos → encuentros → observaciones → crónica. Cuando termines este tutorial, los datos de prueba que usamos se borran solos para que arranques con el navegador limpio. Antes de soltarte, te vamos a pedir un nombre para identificarte en los archivos que exportes.",
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
