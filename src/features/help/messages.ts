export const dataStoragePage = {
  pageTitle: "Cómo se guardan tus datos",
  pageDescription:
    "Antes de arrancar a observar, leé esto: Chronicle guarda todo en tu propio dispositivo. Conocer cómo funciona te evita perder información sin querer.",
} as const;

export const dataStorageGuide = {
  storageSection: {
    title: "Tus datos viven en este navegador",
    intro:
      "Chronicle no usa una nube ni una cuenta. Todo lo que cargás (campos, formularios, proyectos, encuentros, observaciones, fotos, audios, videos y crónicas) se guarda únicamente acá, en el navegador de este dispositivo.",
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
      "La forma más segura de no perder lo que cargaste es exportar todo y guardar ese archivo en un lugar confiable.",
    points: [
      'Desde Configuración, con el botón "Exportar todo", generás un archivo .zip con todos tus campos, formularios, proyectos, encuentros, observaciones, crónicas y archivos multimedia.',
      "Guardá esos .zip en un lugar seguro: una carpeta en la nube, un pendrive, o tu disco.",
      'Para mover tus datos a otro dispositivo o navegador, importá ese mismo .zip desde Configuración, en la sección "Importar".',
      "Si volvés a importar un .zip que ya estaba cargado, se actualizan los datos existentes en lugar de duplicarse.",
      "Hacé exportaciones periódicas, sobre todo antes de limpiar el navegador, cambiar de equipo o trabajar con muchas fotos y videos.",
    ],
    settingsLink: "Ir a Configuración",
  },
  recommendationsSection: {
    title: "Recomendaciones para el día a día",
    points: [
      "Usá siempre el mismo navegador en el mismo dispositivo para seguir un mismo ciclo de trabajo.",
      "Evitá modo incógnito o privado para tareas reales: dejalo solo para probar.",
      "Si tenés muchas fotos o videos, controlá el espacio libre del dispositivo: si se llena, el navegador puede empezar a fallar al guardar.",
      "Si vas a prestar la compu o el celular, exportá tus datos antes para tener una copia.",
      "Si instalás Chronicle como aplicación (PWA), los datos siguen viviendo en el navegador desde el cual la instalaste.",
    ],
  },
  privacySection: {
    title: "Privacidad",
    intro:
      "Como nada se sube a un servidor, tus observaciones quedan solo en tu dispositivo. Eso también significa que sos el responsable de cuidarlas: lo que no exportás, no se recupera desde otro lado.",
  },
} as const;

export const aiSetupGuide = {
  whatSection: {
    title: "Qué hace la generación con IA",
    description:
      "Si configurás una clave de API de Gemini (gratuita), Chronicle la usa para generar crónicas en prosa narrativa en lugar del resumen estructurado por defecto. El resultado es un texto corrido, organizado y más fácil de leer y compartir.",
    points: [
      "La generación con IA es completamente opcional: sin clave, Chronicle funciona exactamente igual que siempre con su generador local.",
      'Cuando la clave está configurada, al lado del botón "Generar crónica" se muestra el cartelito "IA activa" y la IA se usa automáticamente al generar o regenerar.',
      "Si la generación con IA falla (sin conexión, cuota agotada o clave inválida), Chronicle te avisa con un mensaje claro y mantiene la última crónica que ya tenías guardada para ese encuentro.",
      "Si volvés a generar una crónica y las observaciones no cambiaron, Chronicle reutiliza la última generada con IA en vez de gastar una nueva consulta a Gemini.",
    ],
  },
  privacySection: {
    title: "Privacidad y datos enviados",
    description:
      "Cuando generás una crónica con IA, se envían los datos de texto del encuentro a los servidores de Google a través de la API de Gemini. Es importante que sepas exactamente qué se envía y qué no:",
    sentPoints: [
      "Nombre del encuentro y del proyecto.",
      "Fechas y horarios de inicio y cierre del encuentro.",
      "Nombres de los participantes que estuvieron.",
      "Los valores de texto de las observaciones (campos de texto, números, fechas, elecciones, etc.).",
    ],
    notSentPoints: [
      "Archivos multimedia: imágenes, videos, audios y documentos nunca se envían.",
      "La clave de API nunca sale de tu navegador ni pasa por ningún servidor de Chronicle.",
    ],
    warning:
      "Si trabajás con datos sensibles o la institución tiene restricciones de confidencialidad, no configures la clave y usá la generación local.",
  },
  setupSection: {
    title: "Cómo obtener tu clave gratuita",
    steps: [
      "Entrá a Google AI Studio en aistudio.google.com con tu cuenta de Google.",
      'Hacé clic en "Get API key" y luego en "Create API key".',
      "Copiá la clave generada (empieza con AIza...).",
      "Volvé a la página de Configuración de Chronicle y pegala en el campo de clave de API.",
    ],
    note: "El tier gratuito de Gemini incluye hasta 1.500 requests por día y 1 millón de tokens por minuto, más que suficiente para generar crónicas.",
    ctaLabel: "Ir a Configuración",
    ctaTo: "/settings",
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
    title: "2. Armá uno o más formularios de observación",
    description:
      "Un formulario es un conjunto ordenado de campos. Es la plantilla que vas a completar al cargar cada observación. Si más adelante editás un formulario se guarda una versión nueva, así las observaciones viejas siguen mostrando exactamente la versión que usaron.",
    cta: { label: "Ir a formularios", to: "/forms" },
  },
  {
    title: "3. Creá un proyecto con sus participantes",
    description:
      "Un proyecto agrupa a las personas que vas a observar y a los encuentros que tengan entre sí. Sumás los participantes una vez y los reutilizás en cada encuentro del proyecto.",
    cta: { label: "Ir a proyectos", to: "/projects" },
  },
  {
    title: "4. Registrá cada encuentro post-evento",
    description:
      "Después de que un encuentro ocurrió, lo cargás dentro del proyecto: nombre, fecha y hora de inicio y cierre, y qué participantes del proyecto estuvieron presentes. Podés crear tantos encuentros como quieras.",
    cta: { label: "Ir a proyectos", to: "/projects" },
  },
  {
    title: "5. Cargá las observaciones del encuentro",
    description:
      "Dentro del encuentro vas sumando observaciones. Para cada una elegís el formulario que mejor describa lo que viste — podés mezclar formularios distintos en un mismo encuentro. Cada observación puede llevar texto, números, elecciones, fechas y archivos multimedia: fotos, videos y audios.",
  },
  {
    title: "6. Generá la crónica",
    description:
      'Desde el detalle del encuentro entrás a "Ver crónica" y desde ahí la generás. Si configuraste una clave de API de Gemini en Configuración, sale en prosa narrativa rica; si no, sale como un resumen estructurado.',
    cta: { label: "Ir a crónicas", to: "/chronicles" },
  },
];

export const howItWorksGuide = {
  intro: {
    title: "Para qué sirve Chronicle",
    description:
      "Chronicle te ayuda a documentar lo que pasó en encuentros de un proyecto y a transformar esas observaciones en una crónica clara.",
    points: [
      "Está pensado para usar después del encuentro: registrás cuándo ocurrió, quiénes estuvieron y qué viste, sin trabarte con la herramienta durante la sesión real.",
      "Funciona desde el navegador, también sin conexión: ideal para situaciones reales en aulas, talleres, prácticas o salidas.",
      "Cada concepto (campo, formulario, proyecto, encuentro, observación, crónica) tiene una función concreta dentro del flujo.",
    ],
  },
  workflow: {
    title: "El flujo en 6 pasos",
    description: "Esta es la secuencia natural para empezar y dejar todo configurado.",
    steps: workflowSteps,
  },
  share: {
    title: "Compartir y mover datos",
    description:
      "Como Chronicle no usa una nube, para mover lo que cargaste entre dispositivos o personas usás archivos .zip.",
    points: [
      'Desde Configuración usás "Exportar todo" para bajar un .zip con todos tus campos, formularios, proyectos, encuentros, observaciones y crónicas.',
      'En el otro navegador o dispositivo, entrás a Configuración y arrastrás ese .zip al área "Importar" para recuperar todo tal cual.',
      "Si importás algo que ya existía, se actualiza en lugar de duplicarse.",
      'Para compartir una crónica con alguien sin pasar la base entera, usá el botón "Compartir" desde el detalle de la crónica: usa la función nativa de tu sistema o copia el texto al portapapeles.',
    ],
    importLink: { label: "Ir a Configuración", to: "/settings" },
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
