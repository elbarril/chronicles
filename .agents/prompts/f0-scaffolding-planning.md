# Prompt de Planning - Fase F0: Scaffolding del Proyecto Chronicle

## Contexto del Proyecto

Chronicle es una aplicación web local-first para capturar observaciones de grupos en instituciones y generar crónicas narrativas.

**Stack técnico definido** (fuente de verdad: `docs/stack-and-architecture.md`):
- Build: Vite
- Lenguaje: TypeScript (strict)
- UI: React 18+ + React Router
- Estilos: Tailwind CSS
- Componentes: shadcn/ui + Radix UI
- Iconos: lucide-react
- Formularios: React Hook Form + Zod
- Persistencia: Dexie.js (IndexedDB)
- PWA: vite-plugin-pwa
- Testing: Vitest + React Testing Library + Playwright
- Lint/Format: ESLint + Prettier
- Gestor: pnpm
- Node: LTS actual (>= 20)

**Principios**:
- UX primero: accesibilidad, bajo fricción
- Simplicidad antes que complejidad
- Mínimas dependencias externas
- Sin backend en v1 (local-first real)

**Estructura de carpetas objetivo** (según arquitectura definida):
```
chronicle/
├─ docs/
├─ public/
├─ src/
│  ├─ app/                    # shell, providers, router
│  │  ├─ router.tsx
│  │  ├─ layout.tsx
│  │  └─ providers.tsx
│  ├─ features/               # casos de uso por dominio
│  │  ├─ field-definitions/
│  │  ├─ forms/
│  │  ├─ encounters/
│  │  ├─ observations/
│  │  └─ chronicles/
│  ├─ domain/                 # tipos + schemas Zod
│  │  ├─ field.ts
│  │  ├─ form.ts
│  │  ├─ encounter.ts
│  │  └─ observation.ts
│  ├─ infra/                  # db, media, export, pwa
│  │  ├─ db/
│  │  │  ├─ schema.ts
│  │  │  ├─ client.ts
│  │  │  └─ repositories/
│  │  ├─ media/
│  │  ├─ export/
│  │  └─ pwa/
│  ├─ components/
│  │  └─ ui/                  # primitivas shadcn
│  ├─ hooks/
│  ├─ lib/
│  ├─ styles/
│  │  └─ globals.css
│  └─ main.tsx
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ playwright.config.ts
└─ .eslintrc / .prettierrc
```

## Objetivo de la Fase F0

Configurar la base técnica del proyecto para que cumpla el criterio de salida:
- `pnpm dev` levanta sin errores
- PWA instalable
- Lint y test configurados y funcionando

## Tareas a Planificar

Planifica la implementación de los siguientes componentes, en el orden que consideres más eficiente:

1. **Inicialización del proyecto**
   - Crear estructura de carpetas base
   - Inicializar Vite con React + TypeScript
   - Configurar pnpm

2. **Configuración de TypeScript**
   - tsconfig.json con strict mode
   - Alias `@/` hacia `src/`

3. **Tailwind CSS**
   - Instalación y configuración
   - Integración con Vite
   - Configurar variables CSS y tema

4. **shadcn/ui**
   - Inicialización del CLI
   - Configuración de paths y componentes base
   - Instalar primitivas iniciales (Button, Input, etc.)

5. **React Router**
   - Instalación y configuración básica
   - Estructura de router con rutas placeholder
   - Layout principal

6. **Dexie.js**
   - Instalación
   - Schema inicial de IndexedDB (según definición en docs/stack-and-architecture.md sección 5.3)
   - Cliente Dexie configurado
   - Estructura de repositorios base

7. **React Hook Form + Zod**
   - Instalación
   - Configuración de zodResolver
   - Schemas base de dominio (según sección 4 del doc)

8. **vite-plugin-pwa**
   - Instalación y configuración
   - Estrategia NetworkFirst para navegación, CacheFirst para assets
   - Manifest PWA

9. **Testing**
   - Vitest + React Testing Library configurado
   - Playwright configurado
   - Test placeholder que valide el setup

10. **Lint y Format**
    - ESLint configurado con reglas de React y TypeScript
    - Prettier configurado
    - Scripts en package.json

11. **Componentes base**
    - Layout principal con providers
    - Router con estructura de rutas inicial
    - Página home placeholder

## Restricciones y Consideraciones

- **No instalar dependencias descartadas explícitamente**: ningún backend, BaaS, state manager global, UI kit pesada, ORM
- **Seguir estructura de carpetas definida** en docs/stack-and-architecture.md sección 5.2
- **Usar pnpm como gestor de paquetes**
- **Configurar TypeScript strict mode**
- **Asegurar accesibilidad**: componentes shadcn/Radix ya traen ARIA correcto
- **Modo oscuro**: incluir desde el inicio como variante
- **Idioma**: código en inglés, UI placeholder en español rioplatense

## Entregable Esperado

Un plan detallado que incluya:

1. **Secuencia de pasos ordenada**: qué hacer primero, qué después, con justificación
2. **Comandos específicos**: comandos de terminal exactos para cada paso
3. **Archivos a crear/modificar**: lista de archivos con su contenido inicial o cambios
4. **Dependencias con versiones**: paquetes a instalar con versiones específicas
5. **Puntos de verificación**: checkpoints intermedios para validar que cada paso funcionó
6. **Riesgos potenciales**: qué podría salir mal y cómo mitigarlo
7. **Tiempo estimado**: estimación razonable de esfuerzo

## Criterio de Éxito del Plan

El plan debe ser:
- **Ejecutable**: un desarrollador o agente puede seguirlo sin ambigüedades
- **Completo**: cubre todos los componentes listados en "Tareas a Planificar"
- **Validable**: cada paso tiene un criterio claro de "funcionó"
- **Coherente** con la arquitectura definida en docs/stack-and-architecture.md
- **Respetuoso** de los principios del proyecto (simplicidad, mínimas dependencias)

## Contexto Adicional

- Documentación completa en `docs/stack-and-architecture.md`
- Glosario de dominio en `.agents/memory/glossary.md`
- Decisiones técnicas en `.agents/memory/decisions.md`
- Principios globales en `AGENTS.md`

---

**Instrucción**: Genera el plan de implementación para Fase F0 siguiendo el formato y criterios arriba especificados.
