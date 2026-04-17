---
description: Crear una nueva skill en .agents/skills/
---

# Create Skill

## Steps

1. Verificar que no existe una skill equivalente en `.agents/skills/`. Si existe, ir al workflow `update-skill` en su lugar.

2. Definir el nombre de la skill en kebab-case con formato `<dominio>-<accion>` (ej: `chronicle-generator`).

3. Crear el directorio:

   ```text
   .agents/skills/<skill-name>/
   ```

4. Copiar el template a la nueva skill:

   ```text
   .agents/templates/skill.template.md
   → .agents/skills/<skill-name>/SKILL.md
   ```

5. Completar todas las secciones obligatorias del SKILL.md:
   - **Description**: una oración
   - **Trigger Conditions**: cuándo usarla (mínimo 2 condiciones)
   - **Steps**: numerados, comienzan con verbo, ordenados por dependencia
   - **Constraints**: qué está PROHIBIDO hacer (sección obligatoria)

6. Agregar scripts de soporte en `.agents/skills/<skill-name>/scripts/` si la skill los requiere.
   Cada script debe incluir un comentario de uso al inicio.

7. Registrar la creación en `.agents/memory/decisions.md`:
   - Formato: `## [YYYY-MM-DD] Creación de skill <skill-name>`
   - Incluir: Contexto, Decisión, Justificación, Consecuencias

8. Actualizar el índice de skills en `.agents/README.md` si la skill es de uso general.

## Notes

- Una skill nueva no debe duplicar lógica de una existente. Referenciar la skill existente desde los pasos.
- Las skills deben ser autocontenidas: no depender de herramientas externas no documentadas.
- Si la skill tiene una contraparte como workflow de Windsurf, crear también `.windsurf/workflows/<skill-name>.md`.
