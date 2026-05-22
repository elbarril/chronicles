# Investigación de Fichas Excel MAE - Estado Actual

**Fecha:** 2025-01-XX  
**Archivos a investigar:**
1. `/home/emiliano/www/emisrepos/chronicle/docs/1.1. MAE. Ficha observación - Niñxs y Adolescentes  (1).xlsx`
2. `/home/emiliano/www/emisrepos/chronicle/docs/1.2.MAE. Ficha evaluación - Niñxs y Adolescentes.xlsx`

---

## 1. Limitación Técnica

**Problema:** No es posible leer directamente los archivos de Excel `.xlsx` porque:
- Las herramientas disponibles (`read`, `grep`, `find_file_by_name`) solo manejan archivos de texto UTF-8
- Los archivos `.xlsx` son binarios y no están en formato de texto legible

**Intento realizado:**
```
read("/home/emiliano/www/emisrepos/chronicle/docs/1.1. MAE. Ficha observación - Niñxs y Adolescentes  (1).xlsx")
Resultado: "file is not valid UTF-8 text"
```

---

## 2. Alternativas Propuestas

### Opción 1: Exportar a CSV desde Excel
**Pasos:**
1. Abrir cada archivo de Excel
2. Usar "Guardar como" → "CSV (delimitado por comas)"
3. Proporcionar los archivos CSV resultantes

**Ventajas:**
- Formato de texto legible
- Estructura tabular preservada
- Fácil de procesar

**Desventajas:**
- Puede perder formatting (negritas, colores, etc.)
- Múltiples hojas requieren múltiples archivos CSV

### Opción 2: Copiar y Pegar Contenido
**Pasos:**
1. Abrir cada archivo de Excel
2. Seleccionar el contenido de cada hoja
3. Copiar y pegar en un archivo de texto o directamente en el chat

**Ventajas:**
- No requiere herramientas externas
- Preserva contenido visible

**Desventajas:**
- Manual y propenso a errores
- Puede perder estructura tabular

### Opción 3: Herramienta de Conversión Externa
**Pasos:**
1. Usar herramienta como `libreoffice --convert-to csv` o `xlsx2csv`
2. Convertir archivos .xlsx a .txt o .csv
3. Proporcionar archivos convertidos

**Ventajas:**
- Automatizado
- Preserva estructura

**Desventajas:**
- Requiere instalación de herramientas externas

### Opción 4: Descripción Manual de Estructura
**Pasos:**
1. Revisar manualmente los archivos de Excel
2. Documentar:
   - Nombres de campos
   - Tipos de datos
   - Validaciones
   - Relaciones entre campos
   - Secciones o grupos lógicos

**Ventajas:**
- Captura semántica y contexto
- No depende de formato

**Desventajas:**
- Requiere tiempo y conocimiento previo de las fichas
- Propenso a omisiones

---

## 3. Información Requerida de las Fichas

Para completar el mapeo exitosamente, se necesita:

### 3.1 Estructura General
- ¿Cuántas hojas tiene cada archivo?
- ¿Qué representa cada hoja?
- ¿Hay diferencias entre la ficha de observación y la de evaluación?

### 3.2 Campos por Hoja
Para cada campo:
- **Nombre/Label:** Texto visible
- **Tipo de dato:** Texto, número, fecha, selección, etc.
- **Obligatorio:** Sí/No
- **Validaciones:** Longitud máxima, rango numérico, opciones disponibles
- **Help text:** Instrucciones o explicaciones
- **Sección:** Grupo lógico al que pertenece

### 3.3 Relaciones y Dependencias
- ¿Hay campos que dependen de otros?
- ¿Hay campos condicionales (solo visibles si otro campo tiene cierto valor)?
- ¿Hay repeticiones de campos similares?

### 3.4 Multimedia
- ¿La ficha incluye campos para imágenes, videos o audio?
- ¿Hay instrucciones específicas para captura de media?

### 3.5 Lógica de Negocio
- ¿Hay cálculos automáticos?
- ¿Hay reglas de validación complejas?
- ¿Hay estados o workflows implícitos?

---

## 4. Arquitectura de Chronicles - Resumen

**Completado:** Documentación completa de la arquitectura del sistema Chronicle generada en:
`/home/emiliano/www/emisrepos/chronicle/docs/architecture-and-entity-management.md`

**Puntos clave para el mapeo:**

### 4.1 Entidades Relevantes
- **Field:** Definición de tipo de dato a capturar
- **FormFieldInstance:** Ocurrencia de un Field dentro de un Form
- **Form:** Lista ordenada de FormFieldInstances
- **Observation:** Valores capturados usando un Form

### 4.2 Tipos de Campos Soportados
```
text, longText, number, boolean, singleChoice, multiChoice,
date, time, datetime, image, video, audio, file, rating, location
```

### 4.3 Configuración por Tipo
- `text`/`longText`: `maxLength`
- `number`/`rating`: `min`, `max`
- `singleChoice`/`multiChoice`: `options`, `minSelect`, `maxSelect`
- `date`/`time`/`datetime`: `min`, `max`
- `image`/`video`/`audio`/`file`: `accept`, `multiple`

### 4.4 Características Avanzadas
- **labelOverride:** Etiqueta personalizada por instancia
- **Múltiples instancias:** El mismo Field puede aparecer varias veces en un Form
- **Snapshot de Form:** Cada Observation guarda el estado del Form al crearse
- **Values keyeados por instanceId:** Permite valores independientes para instancias duplicadas

### 4.5 Seed de Defaults
Los formularios basados en las fichas Excel deberán:
- Definirse en `src/features/defaults/lib/seed-data.ts`
- Usar IDs UUID estables
- Incluirse en el servicio de defaults
- Cargarse automáticamente al primer inicio

---

## 5. Próximos Pasos

### Paso 1: Obtener Contenido de Fichas Excel
**Acción requerida del usuario:**
- Elegir una de las alternativas propuestas (Opción 1, 2, 3 o 4)
- Proporcionar el contenido de las fichas en formato legible

### Paso 2: Analizar Estructura de Fichas
**Una vez obtenido el contenido:**
- Documentar estructura de cada hoja
- Listar todos los campos con sus propiedades
- Identificar tipos de datos y validaciones
- Mapear relaciones y dependencias

### Paso 3: Mapear Campos Excel → Fields
**Para cada campo de Excel:**
- Determinar tipo de Field equivalente
- Configurar validaciones apropiadas
- Definir `key` (identificador único)
- Crear `label` (texto visible)
- Agregar `helpText` si aplica

### Paso 4: Crear FormFieldInstances
**Para cada campo en la ficha:**
- Asignar `instanceId` único (UUID)
- Referenciar `fieldId` correspondiente
- Definir `labelOverride` si necesario
- Ordenar según secuencia en la ficha

### Paso 5: Definir Forms
**Crear dos Forms:**
- **Form de Observación:** Basado en "1.1. MAE. Ficha observación"
- **Form de Evaluación:** Basado en "1.2.MAE. Ficha evaluación"

### Paso 6: Implementar Seed Data
**Agregar a `seed-data.ts`:**
- Definir IDs estables para nuevos Fields
- Definir IDs estables para nuevas FormFieldInstances
- Definir IDs estables para nuevos Forms
- Crear arrays de seed para observación y evaluación

### Paso 7: Actualizar Defaults Service
**Modificar `defaults-service.ts`:**
- Agregar función `restoreMAEForms()` o similar
- Llamar desde `seedDefaultsIfMissing()` o crear función dedicada
- Asegurar idempotencia (no duplicar si ya existen)

### Paso 8: Validar
**Tests:**
- Unit tests para validación de schemas
- Integration tests para seed data
- E2E tests para flujo completo con nuevos forms

### Paso 9: Documentar
**Documentación:**
- Actualizar glosario con nuevos términos
- Registrar decisión en `.agents/memory/decisions.md`
- Crear documento de mapeo específico

---

## 6. Recursos de Referencia

### Archivos de Código
- `src/domain/field.ts` — Definición de Field y tipos
- `src/domain/form.ts` — Definición de Form y FormFieldInstance
- `src/features/defaults/lib/seed-data.ts` — Ejemplo de seed data
- `src/features/defaults/services/defaults-service.ts` — Servicio de defaults

### Documentación
- `docs/stack-and-architecture.md` — Arquitectura completa
- `.agents/memory/glossary.md` — Glosario de términos
- `docs/architecture-and-entity-management.md` — Este documento

---

## 7. Contacto

Para continuar con la investigación, por favor:
1. Elegir una alternativa para proporcionar el contenido de las fichas Excel
2. Compartir el contenido en formato legible
3. Indicar si hay preguntas sobre el mapeo propuesto

---

**Estado:** Esperando contenido de fichas Excel para continuar análisis