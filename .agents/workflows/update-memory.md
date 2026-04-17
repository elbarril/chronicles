---
description: Actualizar un archivo de memoria en .agents/memory/
---

## Steps

1. Identificar qué archivo de memoria corresponde al cambio:

   | Archivo | Cuándo |
   |--------|--------|
   | `project-context.md` | Cambios en estado del proyecto, stack o propósito |
   | `decisions.md` | Decisiones arquitectónicas, técnicas o de producto |
   | `glossary.md` | Términos de dominio nuevos o redefinidos |

2. Abrir el archivo de memoria identificado.

3. **Si es `decisions.md`**:
   - Agregar al final del archivo. NUNCA editar entradas existentes.
   - Usar este formato:

     ```markdown
     ## [YYYY-MM-DD] <Título de la decisión>

     **Contexto:** <Por qué se tomó esta decisión>

     **Decisión:** <Qué se decidió>

     **Justificación:** <Por qué esta opción sobre las alternativas>

     **Consecuencias:**

     - <Consecuencia 1>
     - <Consecuencia 2>
     ```

4. **Si es `project-context.md`**:
   - Actualizar la sección afectada directamente.
   - Eliminar hechos desactualizados para mantener el archivo conciso.
   - Si el cambio es significativo, también registrar en `decisions.md`.

5. **Si es `glossary.md`**:
   - Agregar fila a la tabla en orden alfabético.
   - Si se redefine un término existente, registrar el cambio en `decisions.md` antes de editar el glosario.

6. Verificar que el archivo resultante no viola ningún principio de `AGENTS.md`.

## Notes

- Nunca eliminar entradas de `decisions.md` — es un log append-only.
- Mantener `project-context.md` conciso: es el contexto que los agentes leen al iniciar sesión.
- El glosario define el vocabulario canónico: usarlo de forma consistente en todo el código y documentación.
