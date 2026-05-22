# Plan Estratégico de Implementación: Formularios MAE en Chronicles

**Fecha:** 2025-01-XX  
**Propósito:** Plan detallado y iterativo para implementar los dos nuevos formularios MAE (Ficha de Observación y Ficha de Evaluación) en Chronicles  
**Basado en:** `docs/excel-forms-analysis.md` (Análisis de Oracle)

---

## 1. Resumen Ejecutivo

Este plan divide la implementación de los formularios MAE en **fases iterativas manejables**, cada una con objetivos claros, tareas específicas, criterios de validación y puntos de control contra las fichas Excel originales.

**Alcance del proyecto:**
- **Ficha de Observación:** 263 Fields distribuidos en 8 Forms (uno por encuentro)
- **Ficha de Evaluación:** 29 Fields en 1 Form único
- **Total:** 9 Forms nuevos, ~292 Fields

**Enfoque metodológico:**
- Implementación iterativa con bucles: implementar → revisar → constatar con fichas Excel → dar OK → siguiente fase
- Testing continuo en cada fase (unitario, integración, E2E, seguridad)
- Validación manual como usuario final al completar todas las fases
- Documentación exhaustiva de findings

---

## 2. Estructura de Fases

### Fase 0: Preparación y Configuración (1 día)
### Fase 1: Ficha de Evaluación - MVP (2-3 días)
### Fase 2: Ficha de Observación - Encuentros 1-2 (3-4 días)
### Fase 3: Ficha de Observación - Encuentros 3-5 (3-4 días)
### Fase 4: Ficha de Observación - Encuentros 6-8 (3-4 días)
### Fase 5: Testing Automatizado Completo (2-3 días)
### Fase 6: Testing Manual como Usuario Final (1-2 días)
### Fase 7: Documentación de Findings (1 día)

**Tiempo total estimado:** 15-21 días

---

## 3. Fase 0: Preparación y Configuración

### Objetivo
Preparar el entorno y validar que todos los recursos necesarios están disponibles.

### Tareas Específicas

#### Tarea 0.1: Verificar archivos Excel originales
- **Acción:** Localizar y acceder a los archivos CSV originales:
  - `1.1. MAE. Ficha observación - Niñxs y Adolescentes (1).csv`
  - `1.2.MAE. Ficha evaluación - Niñxs y Adolescentes.csv`
- **Criterio de validación:** Archivos accesibles y legibles
- **Responsable:** Oracle (verificación de disponibilidad)

#### Tarea 0.2: Revisar arquitectura actual de Forms
- **Acción:** Leer y comprender:
  - `docs/architecture-and-entity-management.md`
  - `src/domain/field.ts`
  - `src/domain/form.ts`
  - `src/features/defaults/lib/seed-data.ts`
  - `src/features/defaults/services/defaults-service.ts`
- **Criterio de validación:** Comprensión clara de cómo crear Forms y Fields
- **Responsable:** Strategic Planner (yo)

#### Tarea 0.3: Configurar entorno de testing
- **Acción:** Verificar que las herramientas de testing están configuradas:
  - Unit tests (Vitest/Jest)
  - Integration tests
  - E2E tests (Playwright/Cypress)
  - Security tools (Sentinel)
- **Criterio de validación:** Todas las herramientas ejecutables
- **Responsable:** Trinity (verificación técnica)

#### Tarea 0.4: Crear estructura de documentación
- **Acción:** Crear archivo para tracking de iteraciones:
  - `docs/mae-implementation-tracking.md` (registro de cada iteración, validaciones y OKs)
- **Criterio de validación:** Archivo creado con estructura inicial
- **Responsable:** Strategic Planner (yo)

### Puntos de Control
- [ ] Archivos Excel originales accesibles
- [ ] Arquitectura comprendida
- [ ] Entorno de testing funcional
- [ ] Estructura de tracking creada

### Criterio de OK para pasar a Fase 1
Todas las tareas completadas y validadas. No se puede comenzar la implementación sin esta base.

---

## 4. Fase 1: Ficha de Evaluación - MVP

### Objetivo
Implementar la Ficha de Evaluación (29 Fields en 1 Form) como MVP para validar el enfoque antes de escalar a la Ficha de Observación.

### Iteración 1.1: Definición de Fields

#### Tareas
1. **Definir los 29 Fields en seed-data.ts**
   - 4 Fields de identificación (estudiantes, supervisora, institución, edad)
   - 12 Fields de rating para encuentro 4°
   - 12 Fields de rating para encuentro 8°
   - 1 Field de valoración cualitativa
   - Usar IDs estables con prefijo `mae-eval-`
   
2. **Validar configuración de cada Field**
   - `text`: maxLength: 255, required para identificación
   - `number`: min: 0, max: 18, required para edad
   - `rating`: min: 1, max: 5, step: 1, required para categorías
   - `longText`: maxLength: 5000, optional para valoración cualitativa

#### Criterio de Validación Técnica
- [ ] Todos los Fields definidos con IDs estables
- [ ] Configuraciones correctas según análisis de Oracle
- [ ] Seed data compila sin errores
- [ ] Linting pasa sin warnings

#### Criterio de Validación contra Excel
- [ ] Cada Field mapea a una columna/valor en el CSV original
- [ ] Tipos de dato coinciden con Excel
- [ ] Valores posibles coinciden (rating 1-5)
- [ ] Campos obligatorios en Excel son required en config

### Iteración 1.2: Creación del Form

#### Tareas
1. **Crear Form `mae-eval-form`**
   - Nombre: "MAE - Ficha de Evaluación"
   - Agregar los 29 FormFieldInstances en orden lógico
   - Agrupar por secciones (Identificación, Encuentro 4°, Encuentro 8°, Cualitativa)

2. **Implementar función de restore**
   - Crear `restoreMAEEvaluationForm()` en defaults-service.ts
   - Integrar con el servicio de defaults existente

#### Criterio de Validación Técnica
- [ ] Form creado con ID estable
- [ ] Todos los 29 Fields incluidos como FormFieldInstances
- [ ] Orden de Fields es lógico y usable
- [ ] Función de restore implementada y exportada
- [ ] Seed data genera el Form correctamente

#### Criterio de Validación contra Excel
- [ ] Estructura del Form refleja la estructura de la ficha Excel
- [ ] Agrupación de campos es intuitiva según la ficha
- [ ] Flujo de completado es natural (identificación → enc4 → enc8 → cualitativa)

### Iteración 1.3: Testing Unitario

#### Tareas
1. **Escribir tests unitarios para Fields**
   - Validar que cada Field tiene la configuración correcta
   - Validar que los IDs son estables y únicos
   - Validar restricciones (min, max, maxLength)

2. **Escribir tests unitarios para Form**
   - Validar que el Form contiene todos los Fields esperados
   - Validar que el Form se genera correctamente desde seed data
   - Validar que la función de restore funciona

#### Criterio de Validación
- [ ] Todos los tests unitarios pasan
- [ ] Cobertura de tests > 80% para código nuevo
- [ ] Tests validan tanto happy paths como edge cases

### Iteración 1.4: Testing de Integración

#### Tareas
1. **Escribir tests de integración**
   - Validar que el Form se puede persistir en DB
   - Validar que el Form se puede recuperar de DB
   - Validar que el Form se puede asociar a una Observation
   - Validar que los valores de Fields se guardan correctamente

#### Criterio de Validación
- [ ] Todos los tests de integración pasan
- [ ] Flujo completo de creación → persistencia → recuperación funciona
- [ ] No hay errores de tipos o validaciones en DB

### Iteración 1.5: Validación contra Excel (Punto de Control Crítico)

#### Tareas
1. **Comparación campo por campo**
   - Abrir el CSV `1.2.MAE. Ficha evaluación - Niñxs y Adolescentes.csv`
   - Verificar que cada columna tiene un Field correspondiente
   - Verificar que no hay campos faltantes
   - Verificar que no hay campos sobrantes

2. **Validación de valores**
   - Para cada rating, verificar que la escala 1-5 coincide con Excel
   - Verificar que los campos de texto aceptan los valores esperados
   - Verificar que los campos numéricos aceptan el rango de edad correcto

#### Criterio de OK
- [ ] **100% de campos de Excel mapeados a Fields**
- [ ] **0 campos faltantes**
- [ ] **0 campos sobrantes innecesarios**
- [ ] **Todos los tipos de dato coinciden**
- [ ] **Todas las restricciones coinciden**

**Este es un punto de control CRÍTICO. No se puede avanzar sin un OK explícito aquí.**

### Iteración 1.6: Documentación de Fase 1

#### Tareas
1. **Documentar en tracking**
   - Registrar en `docs/mae-implementation-tracking.md`:
     - Fecha de completado
     - Issues encontrados y resueltos
     - Desviaciones del plan original
     - Lecciones aprendidas

2. **Actualizar decisions.md**
   - Registrar cualquier decisión de diseño tomada durante la fase
   - Usar topic key: `mae-evaluation-implementation`

#### Criterio de Validación
- [ ] Tracking actualizado con detalles completos
- [ ] Decisiones registradas en memory

### Criterio de OK para pasar a Fase 2
- [ ] Todas las iteraciones de Fase 1 completadas
- [ ] Validación contra Excel con 100% de coincidencia
- [ ] Todos los tests (unitario + integración) pasando
- [ ] Documentación actualizada
- [ ] OK explícito del punto de control crítico

---

## 5. Fase 2: Ficha de Observación - Encuentros 1-2

### Objetivo
Implementar los primeros 2 Forms de la Ficha de Observación para validar el enfoque de 8 Forms separados antes de escalar a los 6 restantes.

### Iteración 2.1: Definición de Fields para Encuentros 1-2

#### Tareas
1. **Definir Fields para Encuentro 1**
   - 1 Field: fecha_encuentro (date)
   - 1 Field: edad_participante (number)
   - 4 Fields: CONSIGNA (boolean)
   - 16 Fields: DESARROLLO-PRODUCCIÓN (boolean)
   - 2 Fields extra: dificultad_manipulacion (boolean) + dificultad_manipulacion_cual (text)
   - 9 Fields: CIERRE (boolean)
   - 5 Fields globales: CLIMA GRUPAL + RESPETO AL ENCUADRE + Observaciones
   - Total: ~38 Fields para Encuentro 1 (incluyendo globales)

2. **Definir Fields para Encuentro 2**
   - Mismos campos que Encuentro 1, EXCEPTO:
   - Sin campos globales (CLIMA GRUPAL, RESPETO AL ENCUADRE, Observaciones)
   - Total: ~33 Fields para Encuentro 2

3. **Usar IDs estables con prefijo `mae-obs-`**
   - Encuentro 1: `mae-obs-fecha-encuentro-1`, `mae-obs-la-toma-en-cuenta-enc1`, etc.
   - Encuentro 2: `mae-obs-fecha-encuentro-2`, `mae-obs-la-toma-en-cuenta-enc2`, etc.

#### Criterio de Validación Técnica
- [ ] Todos los Fields definidos con IDs estables
- [ ] Configuraciones correctas (boolean, date, number, longText)
- [ ] Campos globales solo en Encuentro 1
- [ ] Seed data compila sin errores

#### Criterio de Validación contra Excel
- [ ] Cada observable de las filas 1-37 del CSV tiene un Field
- [ ] Observables de CONSIGNA mapeados correctamente
- [ ] Observables de DESARROLLO-PRODUCCIÓN mapeados correctamente
- [ ] Observables de CIERRE mapeados correctamente
- [ ] Campos globales identificados y ubicados en Encuentro 1

### Iteración 2.2: Creación de Forms para Encuentros 1-2

#### Tareas
1. **Crear Form `mae-obs-form-enc-1`**
   - Nombre: "MAE - Ficha de Observación - Encuentro 1"
   - Incluir todos los Fields de Encuentro 1 (incluyendo globales)
   - Orden lógico: Identificación → CONSIGNA → DESARROLLO-PRODUCCIÓN → CIERRE → Globales

2. **Crear Form `mae-obs-form-enc-2`**
   - Nombre: "MAE - Ficha de Observación - Encuentro 2"
   - Incluir todos los Fields de Encuentro 2 (sin globales)
   - Mismo orden lógico que Encuentro 1

3. **Implementar función de restore**
   - Crear `restoreMAEObservationForms()` en defaults-service.ts
   - Restaurar ambos Forms

#### Criterio de Validación Técnica
- [ ] Forms creados con IDs estables
- [ ] Todos los Fields incluidos correctamente
- [ ] Campos globales solo en Form 1
- [ ] Función de restore implementada

#### Criterio de Validación contra Excel
- [ ] Estructura de Forms refleja la estructura matricial del CSV
- [ ] Columna del Encuentro 1 del CSV mapea a Form 1
- [ ] Columna del Encuentro 2 del CSV mapea a Form 2
- [ ] Campos globales ubicados lógicamente

### Iteración 2.3: Implementación de Lógica Condicional

#### Tareas
1. **Implementar lógica para dificultad_manipulacion_cual**
   - En el componente de form rendering:
   - Si `dificultad_manipulacion` = false → ocultar `dificultad_manipulacion_cual`
   - Si `dificultad_manipulacion` = true → mostrar `dificultad_manipulacion_cual` y hacerlo required
   - Aplicar a ambos Forms (Encuentro 1 y 2)

#### Criterio de Validación
- [ ] Lógica condicional funciona en UI
- [ ] Campo condicional se oculta/muestra correctamente
- [ ] Validación required funciona cuando es visible
- [ ] No hay errores de consola

### Iteración 2.4: Testing Unitario

#### Tareas
1. **Escribir tests unitarios para Fields de Observación**
   - Validar configuración de cada Field
   - Validar IDs estables
   - Validar que campos globales están solo en Encuentro 1

2. **Escribir tests unitarios para Forms**
   - Validar que cada Form tiene los Fields correctos
   - Validar que la función de restore funciona

3. **Escribir tests para lógica condicional**
   - Validar comportamiento de show/hide
   - Validar validación dinámica

#### Criterio de Validación
- [ ] Todos los tests unitarios pasan
- [ ] Cobertura de tests > 80% para código nuevo

### Iteración 2.5: Testing de Integración

#### Tareas
1. **Escribir tests de integración**
   - Validar persistencia y recuperación de Forms
   - Validar asociación a Observations
   - Validar que valores de Fields se guardan correctamente
   - Validar lógica condicional en contexto de integración

#### Criterio de Validación
- [ ] Todos los tests de integración pasan
- [ ] Flujo completo funciona

### Iteración 2.6: Validación contra Excel (Punto de Control Crítico)

#### Tareas
1. **Comparación campo por campo para Encuentros 1-2**
   - Abrir el CSV `1.1. MAE. Ficha observación - Niñxs y Adolescentes (1).csv`
   - Verificar columnas de Encuentro 1 y Encuentro 2
   - Verificar que cada observable tiene un Field correspondiente en cada Form
   - Verificar campos globales

2. **Validación de estructura matricial**
   - Verificar que la división en 2 Forms captura correctamente la matriz
   - Verificar que no hay pérdida de información al dividir

#### Criterio de OK
- [ ] **100% de observables de Encuentros 1-2 mapeados**
- [ ] **Campos globales correctamente identificados**
- [ ] **Estructura matricial preservada en la división**
- [ ] **Lógica condicional validada**

**Punto de control CRÍTICO. OK explícito requerido.**

### Iteración 2.7: Documentación de Fase 2

#### Tareas
1. **Documentar en tracking**
   - Registrar en `docs/mae-implementation-tracking.md`
   - Issues específicos de la estructura matricial
   - Lecciones sobre lógica condicional

2. **Actualizar decisions.md**
   - Registrar decisiones sobre ubicación de campos globales
   - Registrar decisiones sobre implementación de lógica condicional
   - Topic keys: `mae-observation-global-fields`, `mae-conditional-field-logic`

#### Criterio de Validación
- [ ] Tracking actualizado
- [ ] Decisiones registradas

### Criterio de OK para pasar a Fase 3
- [ ] Todas las iteraciones de Fase 2 completadas
- [ ] Validación contra Excel con 100% de coincidencia
- [ ] Todos los tests pasando
- [ ] Documentación actualizada
- [ ] OK explícito del punto de control crítico

---

## 6. Fase 3: Ficha de Observación - Encuentros 3-5

### Objetivo
Implementar los Forms para Encuentros 3, 4 y 5, aplicando el patrón validado en Fase 2.

### Iteración 3.1: Definición de Fields para Encuentros 3-5

#### Tareas
1. **Definir Fields para Encuentro 3**
   - Mismo patrón que Encuentro 2 (sin globales)
   - ~33 Fields

2. **Definir Fields para Encuentro 4**
   - Mismo patrón que Encuentro 2
   - ~33 Fields

3. **Definir Fields para Encuentro 5**
   - Mismo patrón que Encuentro 2
   - ~33 Fields

4. **Usar IDs estables**
   - `mae-obs-fecha-encuentro-3`, `mae-obs-la-toma-en-cuenta-enc3`, etc.
   - Patrón consistente para todos los encuentros

#### Criterio de Validación
- [ ] Todos los Fields definidos con IDs estables
- [ ] Patrón consistente con Encuentros 1-2
- [ ] Sin campos globales

### Iteración 3.2: Creación de Forms para Encuentros 3-5

#### Tareas
1. **Crear Forms `mae-obs-form-enc-3`, `mae-obs-form-enc-4`, `mae-obs-form-enc-5`**
   - Nombres: "MAE - Ficha de Observación - Encuentro N"
   - Incluir Fields correspondientes
   - Mismo orden lógico

2. **Actualizar función de restore**
   - Extender `restoreMAEObservationForms()` para incluir los 3 Forms nuevos

#### Criterio de Validación
- [ ] Forms creados con IDs estables
- [ ] Todos los Fields incluidos
- [ ] Función de restore actualizada

### Iteración 3.3: Testing (Unitario + Integración)

#### Tareas
1. **Escribir tests unitarios para Encuentros 3-5**
   - Validar configuración de Fields
   - Validar estructura de Forms

2. **Escribir tests de integración**
   - Validar persistencia y recuperación

#### Criterio de Validación
- [ ] Todos los tests pasan
- [ ] Cobertura mantenida > 80%

### Iteración 3.4: Validación contra Excel (Punto de Control)

#### Tareas
1. **Comparación para Encuentros 3-5**
   - Verificar columnas de Encuentro 3, 4, 5 en CSV
   - Verificar mapeo completo de observables

#### Criterio de OK
- [ ] **100% de observables de Encuentros 3-5 mapeados**
- [ ] **Patrón consistente con Encuentros 1-2**

### Iteración 3.5: Documentación

#### Tareas
1. **Actualizar tracking**
2. **Registrar cualquier decisión nueva**

#### Criterio de Validación
- [ ] Tracking actualizado

### Criterio de OK para pasar a Fase 4
- [ ] Todas las iteraciones completadas
- [ ] Validación contra Excel OK
- [ ] Tests pasando
- [ ] Documentación actualizada

---

## 7. Fase 4: Ficha de Observación - Encuentros 6-8

### Objetivo
Completar la Ficha de Observación implementando los Forms para Encuentros 6, 7 y 8.

### Iteración 4.1: Definición de Fields para Encuentros 6-8

#### Tareas
1. **Definir Fields para Encuentro 6, 7, 8**
   - Mismo patrón que Encuentros 2-5
   - ~33 Fields cada uno

2. **Usar IDs estables**
   - `mae-obs-fecha-encuentro-6`, etc.

#### Criterio de Validación
- [ ] Todos los Fields definidos
- [ ] Patrón consistente

### Iteración 4.2: Creación de Forms para Encuentros 6-8

#### Tareas
1. **Crear Forms `mae-obs-form-enc-6`, `mae-obs-form-enc-7`, `mae-obs-form-enc-8`**
2. **Actualizar función de restore**

#### Criterio de Validación
- [ ] Forms creados
- [ ] Función de restore completa (8 Forms)

### Iteración 4.3: Testing

#### Tareas
1. **Tests unitarios para Encuentros 6-8**
2. **Tests de integración**
3. **Test de integración de todo el set de 8 Forms**
   - Validar que los 8 Forms se pueden restaurar juntos
   - Validar que no hay conflictos de IDs

#### Criterio de Validación
- [ ] Todos los tests pasan
- [ ] Integración de 8 Forms validada

### Iteración 4.4: Validación contra Excel (Punto de Control Crítico Final)

#### Tareas
1. **Comparación completa para toda la Ficha de Observación**
   - Verificar TODAS las columnas del CSV (Encuentros 1-8)
   - Verificar que TODOS los observables están mapeados
   - Verificar que la estructura matricial completa está preservada
   - Verificar campos globales

2. **Validación de integridad**
   - Contar total de Fields: debe ser ~263
   - Contar total de Forms: debe ser 8
   - Verificar que no hay duplicados
   - Verificar que no hay faltantes

#### Criterio de OK
- [ ] **100% de la Ficha de Observación mapeada**
- [ ] **263 Fields implementados**
- [ ] **8 Forms creados**
- [ ] **Estructura matricial completa preservada**
- [ ] **0 duplicados, 0 faltantes**

**Punto de control CRÍTICO FINAL. OK explícito requerido.**

### Iteración 4.5: Documentación de Fase 4

#### Tareas
1. **Actualizar tracking con resumen completo**
2. **Actualizar decisions.md con lecciones finales**

#### Criterio de Validación
- [ ] Tracking completo
- [ ] Decisiones registradas

### Criterio de OK para pasar a Fase 5
- [ ] Todas las iteraciones completadas
- [ ] Validación completa contra Excel OK
- [ ] Todos los tests pasando
- [ ] Documentación actualizada
- [ ] OK explícito del punto de control crítico final

---

## 8. Fase 5: Testing Automatizado Completo

### Objetivo
Ejecutar el suite completo de testing automatizado sobre toda la implementación MAE.

### Iteración 5.1: Testing E2E (End-to-End)

#### Tareas
1. **Escribir tests E2E para Ficha de Evaluación**
   - Flujo completo: usuario crea Observation → selecciona Form → completa todos los campos → guarda
   - Validar que todos los campos se pueden completar
   - Validar que las validaciones funcionan
   - Validar que los datos se persisten correctamente

2. **Escribir tests E2E para Ficha de Observación**
   - Flujo completo para cada uno de los 8 Forms
   - Validar navegación entre Forms
   - Validar lógica condicional
   - Validar persistencia de cada Form

3. **Escribir tests E2E de integración entre Forms**
   - Validar que un usuario puede completar los 8 Forms para un mismo participante
   - Validar que los datos se pueden consultar posteriormente

#### Criterio de Validación
- [ ] Todos los tests E2E pasan
- [ ] Cobertura de flujos críticos > 90%
- [ ] Tests validan tanto happy paths como error cases

### Iteración 5.2: Testing de Seguridad

#### Tareas
1. **Coordinar con Sentinel para testing de seguridad**
   - Validar que no hay inyección de SQL posible
   - Validar que los inputs están sanitizados correctamente
   - Validar que no hay XSS en los campos de texto
   - Validar que los controles de acceso funcionan
   - Validar que los datos sensibles están protegidos

2. **Testing de validación de datos**
   - Validar que no se pueden guardar valores fuera de rango
   - Validar que los campos required no pueden ser omitidos
   - Validar que los campos con maxLength respetan el límite

#### Criterio de Validación
- [ ] Todos los tests de seguridad pasan
- [ ] 0 vulnerabilidades críticas
- [ ] 0 vulnerabilidades de alta severidad
- [ ] Vulnerabilidades medias/bajas documentadas y aceptadas

### Iteración 5.3: Testing de Performance

#### Tareas
1. **Testing de carga**
   - Validar que el sistema puede manejar múltiples usuarios completando Forms simultáneamente
   - Validar que la creación de Observations con Forms MAE no degrada el performance

2. **Testing de renderizado**
   - Validar que los Forms con ~33 Fields se renderizan rápidamente
   - Validar que la UI responde fluidamente

#### Criterio de Validación
- [ ] Performance aceptable (< 2s para renderizar Form)
- [ ] Sin degradación significativa bajo carga

### Iteración 5.4: Ejecución de Suite Completo

#### Tareas
1. **Ejecutar todos los tests**
   - Unit tests
   - Integration tests
   - E2E tests
   - Security tests
   - Performance tests

2. **Generar reporte de cobertura**
   - Cobertura de código
   - Cobertura de flujos
   - Identificar gaps

#### Criterio de Validación
- [ ] Todos los tests pasan
- [ ] Cobertura total > 80%
- [ ] Gaps identificados y documentados

### Iteración 5.5: Documentación de Fase 5

#### Tareas
1. **Documentar resultados de testing**
   - Reporte de ejecución de tests
   - Métricas de cobertura
   - Issues encontrados y resueltos
   - Issues conocidos aceptados

#### Criterio de Validación
- [ ] Reporte completo generado
- [ ] Resultados documentados en tracking

### Criterio de OK para pasar a Fase 6
- [ ] Todos los tests automatizados pasan
- [ ] Seguridad validada por Sentinel
- [ ] Performance aceptable
- [ ] Reporte completo generado

---

## 9. Fase 6: Testing Manual como Usuario Final

### Objetivo
Probar la implementación como usuario final levantando el servidor y probando con Chrome DevTools.

### Iteración 6.1: Preparación de Entorno

#### Tareas
1. **Levantar servidor local**
   - Asegurar que la DB está en estado limpio o con datos de prueba apropiados
   - Levantar el servidor de desarrollo
   - Verificar que no hay errores en startup

2. **Preparar datos de prueba**
   - Tener a mano las fichas Excel originales como referencia
   - Preparar datos de prueba realistas (nombres, edades, etc.)

#### Criterio de Validación
- [ ] Servidor levantado sin errores
- [ ] Datos de prueba preparados

### Iteración 6.2: Testing Manual de Ficha de Evaluación

#### Tareas
1. **Completar Ficha de Evaluación manualmente**
   - Crear una nueva Observation
   - Seleccionar el Form "MAE - Ficha de Evaluación"
   - Completar todos los campos con datos realistas
   - Usar Chrome DevTools para inspeccionar:
     - Que los campos se renderizan correctamente
     - Que los valores se envían correctamente
     - Que no hay errores de consola
     - Que las validaciones funcionan en UI
     - Que la accesibilidad es aceptable (ARIA labels, focus order)

2. **Validar contra Excel**
   - Tener la ficha Excel abierta al lado
   - Completar el Form en paralelo con el Excel
   - Verificar que cada campo del Form tiene un correspondiente en Excel
   - Verificar que los valores posibles coinciden

#### Criterio de Validación
- [ ] Form se completa sin errores
- [ ] UX es intuitiva
- [ ] No hay errores de consola
- [ ] Chrome DevTools no muestra warnings críticos
- [ ] Mapeo con Excel es 100% correcto

### Iteración 6.3: Testing Manual de Ficha de Observación

#### Tareas
1. **Completar los 8 Forms de Observación manualmente**
   - Para un mismo participante, completar los 8 Forms en orden
   - Para cada Form:
     - Completar todos los campos con datos realistas
     - Usar Chrome DevTools para inspeccionar
     - Validar lógica condicional (dificultad_manipulacion)
   - Verificar navegación entre Forms

2. **Validar contra Excel**
   - Tener la matriz Excel abierta al lado
   - Completar los Forms en paralelo con las columnas del Excel
   - Verificar que cada observable tiene un Field correspondiente
   - Verificar que la estructura matricial se preserva en la UX

#### Criterio de Validación
- [ ] Todos los 8 Forms se completan sin errores
- [ ] Navegación entre Forms es fluida
- [ ] Lógica condicional funciona correctamente
- [ ] Chrome DevTools no muestra errores
- [ ] Mapeo con Excel es 100% correcto
- [ ] UX de 8 Forms manejable

### Iteración 6.4: Testing de Edge Cases Manual

#### Tareas
1. **Probar escenarios límite**
   - Dejar campos required vacíos y validar error messages
   - Ingresar valores fuera de rango y validar rechazo
   - Ingresar texto muy largo y validar truncamiento/rechazo
   - Recargar la página mid-form y validar que no se pierden datos (si hay autosave)
   - Completar el Form parcialmente y validar que se puede guardar como borrador (si aplica)

#### Criterio de Validación
- [ ] Edge cases manejados correctamente
- [ ] Error messages son claros y útiles
- [ ] No hay pérdida de datos inesperada

### Iteración 6.5: Testing de Accesibilidad Manual

#### Tareas
1. **Validar accesibilidad con Chrome DevTools**
   - Usar Lighthouse audit para accesibilidad
   - Validar que todos los campos tienen labels apropiados
   - Validar que el focus order es lógico
   - Validar que se puede navegar con teclado
   - Validar que hay suficiente contraste

#### Criterio de Validación
- [ ] Score de Lighthouse > 90
- [ ] Navegación por teclado funciona
- [ ] Labels son claros

### Iteración 6.6: Documentación de Findings Manuales

#### Tareas
1. **Documentar todos los findings del testing manual**
   - Issues de UX encontrados
   - Bugs encontrados
   - Sugerencias de mejora
   - Comportamientos inesperados (si son aceptables)
   - Aspectos positivos a mantener

2. **Capturar evidencia**
   - Screenshots de issues
   - Capturas de Chrome DevTools
   - Videos de flujos si es necesario

#### Criterio de Validación
- [ ] Todos los findings documentados
- [ ] Evidencia capturada
- [ ] Findings clasificados por severidad

### Criterio de OK para pasar a Fase 7
- [ ] Testing manual completado
- [ ] Todos los findings documentados
- [ ] Evidencia capturada
- [ ] Issues críticos identificados para resolución

---

## 10. Fase 7: Documentación de Findings Finales

### Objetivo
Crear un documento consolidado con todos los findings del proceso de implementación y testing.

### Iteración 7.1: Consolidación de Findings

#### Tareas
1. **Recopilar findings de todas las fases**
   - Revisar `docs/mae-implementation-tracking.md`
   - Revisar `.agents/memory/decisions.md`
   - Recopilar findings de testing automatizado
   - Recopilar findings de testing manual

2. **Clasificar findings por categoría**
   - Issues de implementación (resueltos)
   - Issues de diseño (decisiones tomadas)
   - Bugs encontrados (resueltos y pendientes)
   - Issues de UX (sugerencias)
   - Issues de seguridad (validados)
   - Lecciones aprendidas

#### Criterio de Validación
- [ ] Todos los findings recopilados
- [ ] Clasificación completa

### Iteración 7.2: Creación de Documento de Findings

#### Tareas
1. **Crear documento `docs/mae-findings-report.md`**
   - Estructura:
     - Resumen ejecutivo
     - Implementación completada (qué se hizo)
     - Issues resueltos durante implementación
     - Decisiones de diseño tomadas
     - Bugs encontrados y su estado
     - Findings de testing automatizado
     - Findings de testing manual
     - Issues de seguridad
     - Recomendaciones para futuro
     - Lecciones aprendidas

2. **Incluir métricas**
   - Total de Forms creados: 9
   - Total de Fields creados: ~292
   - Cobertura de tests: %
   - Tiempo total de implementación: días
   - Desviaciones del plan original

#### Criterio de Validación
- [ ] Documento creado con estructura completa
- [ ] Todos los findings incluidos
- [ ] Métricas calculadas

### Iteración 7.3: Revisión Final

#### Tareas
1. **Revisar documento completo**
   - Verificar que es claro y completo
   - Verificar que no hay información contradictoria
   - Verificar que las lecciones aprendidas son accionables

2. **Obtener aprobación**
   - Presentar documento a stakeholders
   - Recibir feedback
   - Incorporar cambios si es necesario

#### Criterio de Validación
- [ ] Documento revisado y aprobado
- [ ] Feedback incorporado

### Criterio de OK para cierre del proyecto
- [ ] Documento de findings completo y aprobado
- [ ] Todas las fases completadas
- [ ] Implementación lista para producción

---

## 11. Matriz de Riesgos y Mitigaciones

### Riesgo 1: Complejidad de la estructura matricial
- **Descripción:** La Ficha de Observación es una matriz de 8×37 que puede no mapearse limpiamente a 8 Forms separados
- **Probabilidad:** Media
- **Impacto:** Alto
- **Mitigación:** Validar exhaustivamente en Fase 2 (Encuentros 1-2) antes de escalar
- **Plan de contingencia:** Si el enfoque de 8 Forms no funciona, reconsiderar estructura matricial en arquitectura

### Riesgo 2: Lógica condicional no soportada nativamente
- **Descripción:** La lógica para `dificultad_manipulacion_cual` requiere implementación custom en UI
- **Probabilidad:** Alta
- **Impacto:** Medio
- **Mitigación:** Implementar y validar temprano en Fase 2
- **Plan de contingencia:** Si es muy complejo, hacer ambos campos siempre visibles y validar a nivel de servicio

### Riesgo 3: Fatiga de usuario con 8 Forms
- **Descripción:** Completar 8 Forms separados puede ser tedioso para el usuario
- **Probabilidad:** Media
- **Impacto:** Medio
- **Mitigación:** Validar UX en testing manual (Fase 6)
- **Plan de contingencia:** Considerar mejoras de UX en Fase 3 del plan original (vista de progreso, navegación fluida)

### Riesgo 4: Issues de seguridad en campos de texto
- **Descripción:** Los campos de texto pueden ser vectores de XSS o inyección
- **Probabilidad:** Baja
- **Impacto:** Alto
- **Mitigación:** Coordinar con Sentinel desde Fase 5
- **Plan de contingencia:** Si se encuentran vulnerabilidades, corregir antes de producción

### Riesgo 5: Performance con Forms grandes
- **Descripción:** Forms con ~33 Fields pueden ser lentos de renderizar
- **Probabilidad:** Baja
- **Impacto:** Medio
- **Mitigación:** Testing de performance en Fase 5
- **Plan de contingencia:** Optimizar renderizado o considerar paginación de campos

---

## 12. Recursos y Roles

### Roles y Responsabilidades

| Rol | Responsabilidades |
|-----|-------------------|
| **Strategic Planner (yo)** | Crear y mantener este plan, coordinar fases, validar puntos de control |
| **Trinity** | Implementación técnica de Forms y Fields, writing de tests |
| **Oracle** | Validación contra fichas Excel, investigación de dudas de dominio |
| **Sentinel** | Testing de seguridad, validación de sanitización de inputs |
| **Sion** | Documentación técnica, actualización de docs/ |
| **Smith** | Debugging de issues técnicos durante implementación |

### Herramientas

- **IDE:** VS Code / Windsurf
- **Testing:** Vitest/Jest (unitario), Playwright/Cypress (E2E)
- **Security:** Herramientas de Sentinel
- **Documentación:** Markdown en docs/
- **Tracking:** docs/mae-implementation-tracking.md
- **Control de versiones:** Git

---

## 13. Métricas de Éxito

### Métricas Técnicas
- [ ] 9 Forms creados y funcionando
- [ ] ~292 Fields definidos correctamente
- [ ] Cobertura de tests > 80%
- [ ] 0 vulnerabilidades críticas de seguridad
- [ ] Performance aceptable (< 2s renderizado)

### Métricas de Calidad
- [ ] 100% de campos de Excel mapeados
- [ ] 0 campos faltantes
- [ ] 0 campos sobrantes innecesarios
- [ ] Validación manual exitosa
- [ ] UX aceptable según feedback de testing manual

### Métricas de Proceso
- [ ] Todas las fases completadas en orden
- [ ] Todos los puntos de control OK explícitos
- [ ] Documentación completa y actualizada
- [ ] Lecciones aprendidas documentadas

---

## 14. Cronograma Detallado

### Semana 1
- **Día 1:** Fase 0 (Preparación) + inicio Fase 1
- **Día 2-3:** Fase 1 (Ficha de Evaluación) - Iteraciones 1.1-1.4
- **Día 4:** Fase 1 - Iteración 1.5 (Validación contra Excel - Punto de Control Crítico)
- **Día 5:** Fase 1 - Iteración 1.6 (Documentación)

### Semana 2
- **Día 6-8:** Fase 2 (Observación Encuentros 1-2) - Iteraciones 2.1-2.5
- **Día 9:** Fase 2 - Iteración 2.6 (Validación contra Excel - Punto de Control Crítico)
- **Día 10:** Fase 2 - Iteración 2.7 (Documentación)

### Semana 3
- **Día 11-13:** Fase 3 (Observación Encuentros 3-5)
- **Día 14:** Fase 3 - Validación y documentación
- **Día 15:** Fase 4 inicio (Observación Encuentros 6-8)

### Semana 4
- **Día 16-17:** Fase 4 completado (Observación Encuentros 6-8)
- **Día 18:** Fase 4 - Validación final contra Excel (Punto de Control Crítico Final)
- **Día 19-20:** Fase 5 (Testing Automatizado Completo)

### Semana 5
- **Día 21-22:** Fase 6 (Testing Manual como Usuario Final)
- **Día 23:** Fase 7 (Documentación de Findings Finales)
- **Día 24-25:** Buffer para imprevistos y refinamientos

**Nota:** Este cronograma es estimado. Las fases pueden extenderse si los puntos de control no se aprueban.

---

## 15. Apéndice: Checklist Maestro

### Pre-Implementación
- [ ] Archivos Excel originales localizados y accesibles
- [ ] Arquitectura de Forms comprendida
- [ ] Entorno de testing configurado
- [ ] Estructura de tracking creada

### Fase 1: Ficha de Evaluación
- [ ] 29 Fields definidos
- [ ] 1 Form creado
- [ ] Tests unitarios escritos y pasando
- [ ] Tests de integración escritos y pasando
- [ ] Validación contra Excel 100% OK
- [ ] Documentación actualizada

### Fase 2: Observación Encuentros 1-2
- [ ] Fields para Encuentros 1-2 definidos
- [ ] 2 Forms creados
- [ ] Lógica condicional implementada
- [ ] Tests escritos y pasando
- [ ] Validación contra Excel 100% OK
- [ ] Documentación actualizada

### Fase 3: Observación Encuentros 3-5
- [ ] Fields para Encuentros 3-5 definidos
- [ ] 3 Forms creados
- [ ] Tests escritos y pasando
- [ ] Validación contra Excel 100% OK
- [ ] Documentación actualizada

### Fase 4: Observación Encuentros 6-8
- [ ] Fields para Encuentros 6-8 definidos
- [ ] 3 Forms creados
- [ ] Tests escritos y pasando
- [ ] Validación completa contra Excel 100% OK
- [ ] Documentación actualizada

### Fase 5: Testing Automatizado
- [ ] Tests E2E escritos y pasando
- [ ] Tests de seguridad completados (Sentinel)
- [ ] Tests de performance completados
- [ ] Suite completo ejecutado exitosamente
- [ ] Reporte de cobertura generado

### Fase 6: Testing Manual
- [ ] Servidor levantado y funcional
- [ ] Ficha de Evaluación probada manualmente
- [ ] Ficha de Observación (8 Forms) probada manualmente
- [ ] Edge cases probados
- [ ] Accesibilidad validada
- [ ] Findings documentados

### Fase 7: Documentación Final
- [ ] Findings consolidados
- [ ] Documento de findings creado
- [ ] Documento revisado y aprobado

### Cierre del Proyecto
- [ ] Todos los criterios de éxito cumplidos
- [ ] Documentación completa
- [ ] Implementación lista para producción

---

## 16. Referencias

- `docs/excel-forms-analysis.md` — Análisis completo de Oracle
- `docs/architecture-and-entity-management.md` — Arquitectura de Chronicles
- `src/domain/field.ts` — Definición de Field
- `src/domain/form.ts` — Definición de Form
- `src/features/defaults/lib/seed-data.ts` — Seed data
- `src/features/defaults/services/defaults-service.ts` — Servicio de defaults
- `.agents/memory/decisions.md` — Registro de decisiones
- `.agents/memory/glossary.md` — Glosario de términos

---

**Fin del Plan Estratégico**
