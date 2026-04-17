---
description: Crear un nuevo workflow en .agents/workflows/
---

# Create Workflow

## Steps

1. Verificar que no existe un workflow equivalente en `.agents/workflows/`.

2. Definir el nombre del workflow en kebab-case describiendo el resultado: `<verbo>-<sustantivo>.md` (ej: `generate-chronicle.md`).

3. Crear el archivo: `.agents/workflows/<name>.md`

4. Copiar el template:

   ```text
   .agents/templates/workflow.template.md
   → .agents/workflows/<name>.md
   ```

5. Completar el frontmatter:

   ```yaml
   ---
   description: <Una oración que describe qué logra este workflow>
   ---
   ```

6. Escribir los pasos numerados. Cada paso debe:
   - Comenzar con un verbo de acción
   - Ser específico y ejecutable sin ambigüedad
   - Estar ordenado por dependencia lógica

7. Marcar pasos auto-ejecutables con `// turbo` en la línea anterior al paso (convención Windsurf; ignorado por otros agentes).

8. Referenciar skills por nombre cuando un paso delega en una:

   ```text
   Usar la skill `<skill-name>` para completar este paso.
   ```

9. Agregar una sección `## Notes` con advertencias, casos borde o referencias relevantes.

10. Actualizar `.agents/README.md` si el workflow es de uso general.

## Notes

- No duplicar lógica ya existente en una skill — referenciar la skill.
- Los workflows deben ser herramienta-agnósticos salvo por las anotaciones `// turbo`.
- Si el workflow es frecuentemente invocado desde Windsurf, considerar también crearlo en `.windsurf/workflows/`.
