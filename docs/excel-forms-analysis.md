# Análisis y Mapeo de Fichas Excel MAE para Chronicles

**Fecha:** 2025-01-XX  
**Propósito:** Documentación completa del análisis estructural y mapeo de las fichas Excel MAE (Ficha de Observación y Ficha de Evaluación) a la arquitectura de Chronicles

**Archivos analizados:**
1. `1.1. MAE. Ficha observación - Niñxs y Adolescentes  (1).csv`
2. `1.2.MAE. Ficha evaluación - Niñxs y Adolescentes.csv`

---

## 1. Resumen Ejecutivo

Las fichas Excel MAE para la práctica de Arte Terapia con Niñxs y Adolescentes consisten en dos instrumentos principales:

1. **Ficha de Observación:** Una matriz de seguimiento longitudinal que registra comportamientos observables a través de 8 encuentros, organizada en secciones (Consigna, Desarrollo-Producción, Cierre, Clima Grupal, Respeto al Encuadre).

2. **Ficha de Evaluación:** Una evaluación diagnóstica cuantitativa y cualitativa que mide 12 categorías evaluativas en los encuentros 4° y 8°, usando una escala de 1 a 5.

Ambas fichas requieren un mapeo cuidadoso a la arquitectura de Chronicles, especialmente considerando que la Ficha de Observación usa una estructura matricial (8 encuentros × múltiples observables) que no se mapea directamente al modelo de Forms de Chronicles.

---

## 2. Análisis Detallado: Ficha de Observación

### 2.1 Estructura General

**Tipo:** Matriz de seguimiento longitudinal  
**Dimensiones:** 8 encuentros (columnas) × 37 observables (filas)  
**Uso:** Registro continuo de comportamiento a través de una serie de encuentros

### 2.2 Campos de Identificación

| Campo | Tipo de Dato | Descripción | Obligatorio |
|-------|--------------|-------------|-------------|
| Participante | Texto | Nombre del participante observado | Sí |
| Edad | Número | Edad del participante | Sí |
| Fechas de los encuentros | Fecha (x8) | Fecha de cada uno de los 8 encuentros | Sí |

**Mapeo a Chronicles:**
- `Participante` → No requiere campo en Form (se usa `participantId` de Observation)
- `Edad` → Field tipo `number` con `min: 0`, `max: 18`
- `Fechas de los encuentros` → 8 Fields tipo `date` (uno por encuentro)

### 2.3 Sección: CONSIGNA

**Sub-secciones:** Ninguna (3 observables directos)

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| la toma en cuenta | Booleano | Sí/No | El participante toma en cuenta la consigna |
| trae un emergente propio | Booleano | Sí/No | Trae un tema o emergente personal |
| necesita reiteración | Booleano | Sí/No | Necesita que se repita la consigna |
| se concentra | Booleano | Sí/No | Muestra concentración |

**Mapeo a Chronicles:**
Cada observable se mapea a un Field tipo `boolean`.
**Estructura matricial:** Cada observable debe repetirse 8 veces (una por encuentro) usando `labelOverride` para diferenciar:
- `la_toma_en_cuenta_encuentro_1` → Field tipo `boolean`
- `la_toma_en_cuenta_encuentro_2` → Field tipo `boolean`
- ... hasta `la_toma_en_cuenta_encuentro_8`

**Total Fields para CONSIGNA:** 4 observables × 8 encuentros = 32 Fields

### 2.4 Sección: DESARROLLO-PRODUCCIÓN

**Sub-secciones:** inicio, tiempo, materiales, creatividad, en grupo

#### 2.4.1 Sub-sección: inicio

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| inicia la participación motivado | Booleano | Sí/No | Comienza participando con motivación |
| inicia la participación indiferente | Booleano | Sí/No | Comienza participando con indiferencia |

#### 2.4.2 Sub-sección: tiempo

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| tiempo de inicio dilatado | Booleano | Sí/No | Tarda más de lo esperado en iniciar |
| tiempo de inicio esperable | Booleano | Sí/No | Inicia en tiempo razonable |
| tiempo de realización total dilatado | Booleano | Sí/No | Tarda más de lo esperado en completar |
| tiempo de realización total esperable | Booleano | Sí/No | Completa en tiempo razonable |

#### 2.4.3 Sub-sección: materiales

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| explora los materiales | Booleano | Sí/No | Explora activamente los materiales |
| repite el uso de materiales | Booleano | Sí/No | Repite el uso de los mismos materiales |
| manifiesta dificultad en la manipulación - ¿Cuál? | Booleano + Texto | Sí/No + descripción | Dificultad con materiales (requiere especificación) |
| pide otros materiales | Booleano | Sí/No | Solicita materiales adicionales |

**Nota especial:** "manifiesta dificultad en la manipulación - ¿Cuál?" es un campo compuesto:
- Campo 1: Booleano (¿Hay dificultad?)
- Campo 2: Texto (¿Cuál dificultad?) - solo visible si Campo 1 = Sí

#### 2.4.4 Sub-sección: creatividad

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| pulsión creadora presente | Booleano | Sí/No | Muestra impulso creativo |
| buen nivel de concentración y trabajo | Booleano | Sí/No | Se concentra bien en el trabajo |
| buen nivel de tolerancia a la frustración | Booleano | Sí/No | Tolerancia a la frustración adecuada |

#### 2.4.5 Sub-sección: en grupo

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| pide ayuda | Booleano | Sí/No | Solicita ayuda a otros |
| se comunica | Booleano | Sí/No | Se comunica con el grupo |
| se aisla | Booleano | Sí/No | Se aísla del grupo |
| ayuda a otros | Booleano | Sí/No | Ayuda a otros participantes |
| establece vínculo favorable con el AT | Booleano | Sí/No | Establece buen vínculo con el terapeuta |

**Total Fields para DESARROLLO-PRODUCCIÓN:** 16 observables × 8 encuentros = 128 Fields  
**Nota adicional:** "manifiesta dificultad en la manipulación - ¿Cuál?" requiere 2 Fields por encuentro (boolean + text) = 16 Fields extra

### 2.5 Sección: CIERRE

**Sub-secciones:** Implicancia afectiva, grupo

#### 2.5.1 Sub-sección: Implicancia afectiva

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| acepta su propia obra | Booleano | Sí/No | Acepta lo que produjo |
| puede poner en palabras lo producido | Booleano | Sí/No | Puede verbalizar su producción |
| realiza asociaciones denotativas | Booleano | Sí/No | Hace asociaciones literales |
| realiza asociaciones connotativas | Booleano | Sí/No | Hace asociaciones simbólicas |
| manifiesta cambios humor con respecto al inicio | Booleano | Sí/No | Cambio de humor desde el inicio |
| manifiesta cambios de actitud corporal respecto al inicio | Booleano | Sí/No | Cambio de lenguaje corporal |

#### 2.5.2 Sub-sección: grupo

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| respeta la palabra de los otros | Booleano | Sí/No | Respeta cuando otros hablan |
| es indiferente ante la palabra de los otros | Booleano | Sí/No | No reacciona a los otros |
| logra esperar su turno | Booleano | Sí/No | Puede esperar su turno |

**Total Fields para CIERRE:** 9 observables × 8 encuentros = 72 Fields

### 2.6 Sección: CLIMA GRUPAL

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| favorecedor | Booleano | Sí/No | El clima grupal es favorable |
| disruptivo | Booleano | Sí/No | El clima grupal es disruptivo |
| indiferente | Booleano | Sí/No | El clima grupal es indiferente |
| participativo | Booleano | Sí/No | El clima grupal es participativo |

**Nota:** Estos campos NO son por encuentro, son evaluaciones globales del clima grupal en general.

**Mapeo a Chronicles:** 4 Fields tipo `boolean` (sin repetición por encuentro)

### 2.7 Sección: RESPETO AL ENCUADRE

| Observable | Tipo de Dato | Valores Posibles | Descripción |
|------------|--------------|------------------|-------------|
| RESPETO AL ENCUADRE | Booleano | Sí/No | Respeta las reglas del encuadre |

**Nota:** Campo global, no por encuentro.

**Mapeo a Chronicles:** 1 Field tipo `boolean`

### 2.8 Sección: Observaciones

| Campo | Tipo de Dato | Descripción |
|-------|--------------|-------------|
| Observaciones | LongText | Notas cualitativas generales |

**Mapeo a Chronicles:** 1 Field tipo `longText`

### 2.9 Resumen de Fields para Ficha de Observación

| Categoría | Cantidad de Fields | Tipo |
|-----------|-------------------|------|
| Identificación (Participante) | 0 | (usa participantId) |
| Identificación (Edad) | 1 | number |
| Fechas de encuentros | 8 | date |
| CONSIGNA | 32 | boolean (4 × 8) |
| DESARROLLO-PRODUCCIÓN | 128 | boolean (16 × 8) |
| Dificultad materiales (extra) | 16 | text (8 × 2) |
| CIERRE | 72 | boolean (9 × 8) |
| CLIMA GRUPAL | 4 | boolean |
| RESPETO AL ENCUADRE | 1 | boolean |
| Observaciones | 1 | longText |
| **TOTAL** | **263** | |

### 2.10 Problema de Escalabilidad y Solución Propuesta

**Problema:** La estructura matricial de la Ficha de Observación (263 Fields) es excesiva para el modelo actual de Forms de Chronicles, donde cada Field se define individualmente.

**Solución Propuesta 1: Form por Encuentro**
- Crear 8 Forms separados, uno por encuentro
- Cada Form tiene ~33 Fields (identificación + observables de ese encuentro)
- Ventaja: Más manejable, alineado con flujo de trabajo real
- Desventaja: Requiere 8 Forms en lugar de 1

**Solución Propuesta 2: Repetición Dinámica (Futuro)**
- Implementar un tipo de Field "repeating" o "matrix"
- Definir el observable una vez, especificar número de repeticiones
- Ventaja: Más eficiente en definición
- Desventaja: Requiere cambios en arquitectura

**Recomendación:** Implementar Solución 1 (Form por Encuentro) para MVP, considerar Solución 2 para futuras iteraciones.

---

## 3. Análisis Detallado: Ficha de Evaluación

### 3.1 Estructura General

**Tipo:** Evaluación diagnóstica cuantitativa y cualitativa  
**Momentos de evaluación:** Encuentro 4° y Encuentro 8°  
**Categorías:** 12 categorías evaluativas con escala 1-5

### 3.2 Campos de Identificación

| Campo | Tipo de Dato | Descripción | Obligatorio |
|-------|--------------|-------------|-------------|
| Estudiante/s | Texto | Nombre(s) del estudiante(s) a cargo | Sí |
| Supervisora | Texto | Nombre de la supervisora | Sí |
| Institución | Texto | Nombre de la institución | Sí |
| Participante-Nombre | Texto | Nombre del participante evaluado | Sí |
| Edad | Número | Edad del participante | Sí |

**Mapeo a Chronicles:**
- `Estudiante/s` → Field tipo `text`
- `Supervisora` → Field tipo `text`
- `Institución` → Field tipo `text`
- `Participante-Nombre` → No requiere campo (usa participantId)
- `Edad` → Field tipo `number` con `min: 0`, `max: 18`

### 3.3 Categorías Evaluativas Diagnósticas

**Escala de valoración:** 1 (más bajo) - 2-3 (medio) - 4 (alto) - 5 (muy alto)

| Categoría | Tipo de Dato | Valores | Momentos de Evaluación |
|-----------|--------------|---------|------------------------|
| Nivel de disposición al trabajo | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de interés hacia la motivación | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de interés hacia la consigna | Rating | 1-5 | 4° y 8° encuentro |
| Nivel general de concentración | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de tolerancia a la frustración | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de experimentación con los materiales | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de producción de imágenes subjetivas | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de logro (finalización de la producción) | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de Interacción con los pares | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de socialización de su producción | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de reciprocidad (escucha) con sus pares | Rating | 1-5 | 4° y 8° encuentro |
| Nivel de adecuación al encuadre | Rating | 1-5 | 4° y 8° encuentro |

**Mapeo a Chronicles:**
Cada categoría se mapea a 2 Fields tipo `rating`:
- `disposicion_trabajo_encuentro_4` → Field tipo `rating` con `min: 1`, `max: 5`, `step: 1`
- `disposicion_trabajo_encuentro_8` → Field tipo `rating` con `min: 1`, `max: 5`, `step: 1`

**Total Fields para categorías evaluativas:** 12 categorías × 2 momentos = 24 Fields

### 3.4 Valoración Cualitativa

| Campo | Tipo de Dato | Descripción |
|-------|--------------|-------------|
| Valoración cualitativa (Comentarios) | LongText | Comentarios cualitativos generales |

**Mapeo a Chronicles:** 1 Field tipo `longText`

### 3.5 Resumen de Fields para Ficha de Evaluación

| Categoría | Cantidad de Fields | Tipo |
|-----------|-------------------|------|
| Estudiante/s | 1 | text |
| Supervisora | 1 | text |
| Institución | 1 | text |
| Edad | 1 | number |
| Categorías evaluativas (4°) | 12 | rating |
| Categorías evaluativas (8°) | 12 | rating |
| Valoración cualitativa | 1 | longText |
| **TOTAL** | **29** | |

### 3.6 Estructura de Form Recomendada

**Recomendación:** Crear un único Form para la Ficha de Evaluación, ya que la cantidad de Fields (29) es manejable y la evaluación se realiza en dos momentos específicos (4° y 8° encuentro) que pueden documentarse en una sola Observation.

---

## 4. Mapeo Completo a Tipos de Field de Chronicles

### 4.1 Tipos de Field Utilizados

| Tipo de Field | Uso en Fichas MAE | Cantidad Total |
|---------------|-------------------|----------------|
| `text` | Identificación (estudiante, supervisora, institución) | 3 |
| `longText` | Observaciones, valoración cualitativa | 2 |
| `number` | Edad (ambas fichas) | 2 |
| `boolean` | Observables binarios (ficha observación) | 237 |
| `rating` | Categorías evaluativas (ficha evaluación) | 24 |
| `date` | Fechas de encuentros (ficha observación) | 8 |

### 4.2 Configuraciones por Tipo

#### 4.2.1 Fields tipo `number`

```typescript
{
  type: "number",
  config: {
    min: 0,
    max: 18
  }
}
```

**Uso:** Edad en ambas fichas

#### 4.2.2 Fields tipo `boolean`

```typescript
{
  type: "boolean",
  config: {}
}
```

**Uso:** Todos los observables binarios de la Ficha de Observación

#### 4.2.3 Fields tipo `rating`

```typescript
{
  type: "rating",
  config: {
    min: 1,
    max: 5,
    step: 1
  }
}
```

**Uso:** Categorías evaluativas de la Ficha de Evaluación

#### 4.2.4 Fields tipo `text`

```typescript
{
  type: "text",
  config: {
    maxLength: 255
  }
}
```

**Uso:** Estudiante/s, Supervisora, Institución

#### 4.2.5 Fields tipo `longText`

```typescript
{
  type: "longText",
  config: {
    maxLength: 5000
  }
}
```

**Uso:** Observaciones, Valoración cualitativa

#### 4.2.6 Fields tipo `date`

```typescript
{
  type: "date",
  config: {}
}
```

**Uso:** Fechas de los 8 encuentros

---

## 5. Estructura de Forms Recomendada

### 5.1 Ficha de Observación

**Opción Recomendada: 8 Forms (uno por encuentro)**

**Nombre del Form:** `MAE - Ficha de Observación - Encuentro {N}`

**Estructura por Form (33 Fields cada uno):**

1. **Identificación del encuentro**
   - Field: `fecha_encuentro` (tipo: `date`)
   - Field: `edad_participante` (tipo: `number`)

2. **Sección: CONSIGNA** (4 Fields)
   - `la_toma_en_cuenta`
   - `trae_emergente_propio`
   - `necesita_reiteracion`
   - `se_concentra`

3. **Sección: DESARROLLO-PRODUCCIÓN** (16 Fields + 2 extra)
   - **inicio** (2 Fields)
     - `inicia_participacion_motivado`
     - `inicia_participacion_indiferente`
   - **tiempo** (4 Fields)
     - `tiempo_inicio_dilatado`
     - `tiempo_inicio_esperable`
     - `tiempo_realizacion_dilatado`
     - `tiempo_realizacion_esperable`
   - **materiales** (4 Fields + 2 extra)
     - `explora_materiales`
     - `repite_uso_materiales`
     - `dificultad_manipulacion` (boolean)
     - `dificultad_manipulacion_cual` (text, condicional)
     - `pide_otros_materiales`
   - **creatividad** (3 Fields)
     - `pulsion_creadora_presente`
     - `buen_nivel_concentracion_trabajo`
     - `buen_nivel_tolerancia_frustracion`
   - **en grupo** (5 Fields)
     - `pide_ayuda`
     - `se_comunica`
     - `se_aisla`
     - `ayuda_otros`
     - `vinculo_favorable_at`

4. **Sección: CIERRE** (9 Fields)
   - **Implicancia afectiva** (6 Fields)
     - `acepta_propia_obra`
     - `pone_palabras_lo_producido`
     - `asociaciones_denotativas`
     - `asociaciones_connotativas`
     - `cambios_humor_inicio`
     - `cambios_actitud_corporal_inicio`
   - **grupo** (3 Fields)
     - `respeta_palabra_otros`
     - `indiferente_palabra_otros`
     - `logra_esperar_turno`

5. **Secciones globales** (5 Fields - solo en Form del Encuentro 1 o separado)
   - `clima_grupal_favorecedor`
   - `clima_grupal_disruptivo`
   - `clima_grupal_indiferente`
   - `clima_grupal_participativo`
   - `respeto_encuadre`
   - `observaciones_generales` (longText)

**Total Forms:** 8  
**Fields por Form:** ~33  
**Fields totales:** ~264 (incluyendo globales)

**IDs Estables Sugeridos:**
- Form IDs: `mae-obs-form-enc-1` a `mae-obs-form-enc-8`
- Field IDs: Prefijo `mae-obs-` + nombre descriptivo

### 5.2 Ficha de Evaluación

**Opción Recomendada: 1 Form único**

**Nombre del Form:** `MAE - Ficha de Evaluación`

**Estructura del Form (29 Fields):**

1. **Identificación** (4 Fields)
   - `estudiantes` (text)
   - `supervisora` (text)
   - `institucion` (text)
   - `edad_participante` (number)

2. **Categorías Evaluativas - Encuentro 4°** (12 Fields)
   - `disposicion_trabajo_enc4` (rating)
   - `interes_motivacion_enc4` (rating)
   - `interes_consigna_enc4` (rating)
   - `concentracion_enc4` (rating)
   - `tolerancia_frustracion_enc4` (rating)
   - `experimentacion_materiales_enc4` (rating)
   - `produccion_imagenes_enc4` (rating)
   - `logro_finalizacion_enc4` (rating)
   - `interaccion_pares_enc4` (rating)
   - `socializacion_produccion_enc4` (rating)
   - `reciprocidad_escucha_enc4` (rating)
   - `adecuacion_encuadre_enc4` (rating)

3. **Categorías Evaluativas - Encuentro 8°** (12 Fields)
   - `disposicion_trabajo_enc8` (rating)
   - `interes_motivacion_enc8` (rating)
   - `interes_consigna_enc8` (rating)
   - `concentracion_enc8` (rating)
   - `tolerancia_frustracion_enc8` (rating)
   - `experimentacion_materiales_enc8` (rating)
   - `produccion_imagenes_enc8` (rating)
   - `logro_finalizacion_enc8` (rating)
   - `interaccion_pares_enc8` (rating)
   - `socializacion_produccion_enc8` (rating)
   - `reciprocidad_escucha_enc8` (rating)
   - `adecuacion_encuadre_enc8` (rating)

4. **Valoración Cualitativa** (1 Field)
   - `valoracion_cualitativa` (longText)

**Total Forms:** 1  
**Fields por Form:** 29  
**Fields totales:** 29

**ID Estable Sugerido:**
- Form ID: `mae-eval-form`
- Field IDs: Prefijo `mae-eval-` + nombre descriptivo

---

## 6. Validaciones y Lógica de Negocio

### 6.1 Validaciones de Campo

#### 6.1.1 Ficha de Observación

| Campo | Validación | Implementación |
|-------|------------|----------------|
| edad_participante | required, min: 0, max: 18 | `required: true`, `config.min: 0`, `config.max: 18` |
| fecha_encuentro | required | `required: true` |
| dificultad_manipulacion_cual | required si dificultad_manipulacion = true | Validación condicional en UI |
| Todos los booleanos | optional (por defecto) | `required: false` |

#### 6.1.2 Ficha de Evaluación

| Campo | Validación | Implementación |
|-------|------------|----------------|
| estudiantes | required, maxLength: 255 | `required: true`, `config.maxLength: 255` |
| supervisora | required, maxLength: 255 | `required: true`, `config.maxLength: 255` |
| institucion | required, maxLength: 255 | `required: true`, `config.maxLength: 255` |
| edad_participante | required, min: 0, max: 18 | `required: true`, `config.min: 0`, `config.max: 18` |
| Todos los rating | required, min: 1, max: 5, step: 1 | `required: true`, `config.min: 1`, `config.max: 5`, `config.step: 1` |
| valoracion_cualitativa | optional, maxLength: 5000 | `required: false`, `config.maxLength: 5000` |

### 6.2 Lógica Condicional

#### 6.2.1 Campo compuesto: Dificultad en manipulación

**Lógica:**
- Si `dificultad_manipulacion` = `false` → Ocultar `dificultad_manipulacion_cual`
- Si `dificultad_manipulacion` = `true` → Mostrar `dificultad_manipulacion_cual` y hacerlo required

**Implementación:** Requiere lógica de UI en el componente de form rendering (no soportado nativamente por Field config).

### 6.3 Relaciones entre Campos

#### 6.3.1 Ficha de Observación

No hay relaciones complejas entre campos más allá de la lógica condicional mencionada.

#### 6.3.2 Ficha de Evaluación

No hay relaciones entre campos. Los 12 ratings del encuentro 4° y los 12 del encuentro 8° son independientes.

---

## 7. Seed Data y IDs Estables

### 7.1 IDs Estables para Fields

**Convención de:**
- Prefijo: `mae-obs-` para Ficha de Observación
- Prefijo: `mae-eval-` para Ficha de Evaluación
- Sufijo: nombre descriptivo en snake_case

**Ejemplos:**
- `mae-obs-fecha-encuentro-1`
- `mae-obs-la-toma-en-cuenta-enc1`
- `mae-eval-disposicion-trabajo-enc4`
- `mae-eval-valoracion-cualitativa`

### 7.2 IDs Estables para Forms

**Ficha de Observación:**
- `mae-obs-form-enc-1` (Encuentro 1)
- `mae-obs-form-enc-2` (Encuentro 2)
- ...
- `mae-obs-form-enc-8` (Encuentro 8)

**Ficha de Evaluación:**
- `mae-eval-form` (Único form)

### 7.3 Implementación en Seed Data

**Archivo:** `src/features/defaults/lib/seed-data.ts`

**Estructura sugerida:**

```typescript
// MAE Observation Forms
export const MAE_OBSERVATION_FORMS: ObservationFormInput[] = [
  {
    id: "mae-obs-form-enc-1",
    name: "MAE - Ficha de Observación - Encuentro 1",
    fields: [
      // 33 FormFieldInstances para encuentro 1
    ]
  },
  // ... forms para encuentros 2-8
];

// MAE Evaluation Form
export const MAE_EVALUATION_FORM: ObservationFormInput = {
  id: "mae-eval-form",
  name: "MAE - Ficha de Evaluación",
  fields: [
    // 29 FormFieldInstances
  ]
};

// MAE Fields
export const MAE_FIELDS: FieldFormInput[] = [
  // Todos los fields definidos (292 total)
];
```

---

## 8. Recomendaciones de Implementación

### 8.1 Fase 1: MVP (Mínimo Producto Viable)

**Objetivo:** Implementar Ficha de Evaluación primero (más simple)

**Tareas:**
1. Definir los 29 Fields de la Ficha de Evaluación en seed-data.ts
2. Crear el Form `mae-eval-form` con los 29 FormFieldInstances
3. Implementar función `restoreMAEEvaluationForm()` en defaults-service.ts
4. Validar con tests unitarios y E2E
5. Documentar en decisions.md

**Tiempo estimado:** 2-3 días

### 8.2 Fase 2: Ficha de Observación (Simplificada)

**Objetivo:** Implementar Ficha de Observación con 8 Forms separados

**Tareas:**
1. Definir los ~264 Fields de la Ficha de Observación en seed-data.ts
2. Crear los 8 Forms (`mae-obs-form-enc-1` a `mae-obs-form-enc-8`)
3. Implementar función `restoreMAEObservationForms()` en defaults-service.ts
4. Implementar lógica condicional para `dificultad_manipulacion_cual`
5. Validar con tests unitarios y E2E
6. Documentar en decisions.md

**Tiempo estimado:** 5-7 días

### 8.3 Fase 3: Mejoras de UX

**Objetivo:** Mejorar experiencia de usuario para manejar 8 Forms

**Tareas:**
1. Crear vista de "Progreso de Observación" que muestre qué Forms están completados
2. Implementar navegación fluida entre los 8 Forms
3. Agregar vista resumen de todos los observables en una matriz
4. Considerar exportación a CSV para análisis externo

**Tiempo estimado:** 3-5 días

### 8.4 Fase 4: Arquitectura Avanzada (Opcional)

**Objetivo:** Implementar Fields repetibles/matrix

**Tareas:**
1. Diseñar nuevo tipo de Field: `repeating` o `matrix`
2. Actualizar schema de Field para soportar configuración de repetición
3. Actualizar form-builder para soportar definición de Fields repetibles
4. Actualizar observation rendering para desplegar Fields repetibles dinámicamente
5. Migrar Ficha de Observación a usar Fields repetibles
6. Validar y documentar

**Tiempo estimado:** 10-15 días

---

## 9. Decisiones de Diseño

### 9.1 Decisión: Form por Encuentro vs Form Único Matricial

**Decisión:** Implementar 8 Forms separados (uno por encuentro) para la Ficha de Observación.

**Justificación:**
- Alineado con flujo de trabajo real (se documenta un encuentro a la vez)
- Más manejable en términos de cantidad de Fields por Form (~33 vs ~264)
- Evita complejidad de implementar Fields matriciales en MVP
- Permite progreso incremental (completar un encuentro a la vez)

**Trade-off:**
- Requiere más Forms en el sistema (8 vs 1)
- Requiere navegación entre Forms para ver progreso completo
- No hay vista matricial nativa (requiere implementación custom)

**Registrado en:** `.agents/memory/decisions.md` (topic: `mae-observation-form-structure`)

### 9.2 Decisión: Campos Globales en Form de Encuentro 1

**Decisión:** Incluir campos globales (Clima Grupal, Respeto al Encuadre, Observaciones) en el Form del Encuentro 1.

**Justificación:**
- Estos campos se evalúan una vez, no por encuentro
- El Encuentro 1 es el punto de entrada natural
- Simplifica estructura (no requiere Form separado para globales)

**Alternativa considerada:** Form separado para campos globales. Rechazado por complejidad adicional sin beneficio claro.

**Registrado en:** `.agents/memory/decisions.md` (topic: `mae-global-fields-placement`)

### 9.3 Decisión: Lógica Condicional en UI vs Field Config

**Decisión:** Implementar lógica condicional para `dificultad_manipulacion_cual` en el componente de UI, no en Field config.

**Justificación:**
- Field config no soporta nativamente dependencias entre campos
- La lógica es simple (mostrar/ocultar basado en boolean)
- Más flexible para futuras extensiones

**Trade-off:**
- Lógica de UI acoplada a dominio específico MAE
- No reutilizable para otros contextos

**Registrado en:** `.agents/memory/decisions.md` (topic: `mae-conditional-field-logic`)

---

## 10. Glosario de Términos MAE

| Término | Definición | Contexto |
|---------|------------|----------|
| AT | Arte Terapeuta | Profesional a cargo de la práctica |
| Encuadre | Marco de trabajo | Reglas y límites de la práctica terapéutica |
| Emergente propio | Tema personal | Contenido que el participante trae espontáneamente |
| Pulsión creadora | Impulso creativo | Motivación intrínseca para crear |
| Asociaciones denotativas | Asociaciones literales | Relaciones directas y explícitas |
| Asociaciones connotativas | Asociaciones simbólicas | Relaciones implícitas y subjetivas |
| Imágenes subjetivas | Producciones simbólicas | Creaciones con significado personal |
| Reciprocidad (escucha) | Escucha activa | Capacidad de escuchar y ser escuchado |

**Registrado en:** `.agents/memory/glossary.md` (topic: `mae-terminology`)

---

## 11. Próximos Pasos

### 11.1 Inmediatos (Esta sesión)

1. ✅ Analizar estructura de fichas Excel
2. ✅ Mapear campos de Excel a Fields
3. ✅ Definir estructura de Forms
4. ⬜ Crear seed data con IDs estables
5. ⬜ Actualizar service de defaults
6. ⬜ Documentar decisiones en decisions.md
7. ⬜ Actualizar glosario con términos MAE

### 11.2 Corto Plazo (Próxima semana)

1. Implementar Fase 1 (Ficha de Evaluación)
2. Validar con tests
3. Demostrar a stakeholders
4. Recibir feedback

### 11.3 Mediano Plazo (Próximo mes)

1. Implementar Fase 2 (Ficha de Observación)
2. Implementar Fase 3 (Mejoras de UX)
3. Documentar lecciones aprendidas
4. Planificar Fase 4 si es necesario

---

## 12. Referencias

- `docs/architecture-and-entity-management.md` — Arquitectura completa de Chronicles
- `docs/excel-files-investigation-status.md` — Estado de investigación de archivos Excel
- `src/domain/field.ts` — Definición de tipos de Field
- `src/domain/form.ts` — Definición de Form y FormFieldInstance
- `src/features/defaults/lib/seed-data.ts` — Datos de seed por defecto
- `src/features/defaults/services/defaults-service.ts` — Servicio de defaults
- `.agents/memory/decisions.md` — Registro de decisiones de diseño
- `.agents/memory/glossary.md` — Glosario de términos del dominio

---

**Fin del documento**