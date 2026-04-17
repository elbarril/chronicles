---
description: Crear commit y push con selección interactiva de rama y tipo de cambio.
---

# Interactive Commit Push

## Steps

1. Validar estado del repo con `git status --short --branch` y listar cambios para contexto.

2. Preguntar interactivamente si se desea usar la rama actual:
   - Prompt: `¿Querés commitear y pushear en la rama actual (<branch>)? [s/n]`
   - Si la respuesta es `s`, continuar directamente sin volver a preguntar por rama.
   - Si la respuesta es `n`, pedir la rama destino y validar su existencia local/remota.

3. Mostrar tipos de cambio disponibles y pedir selección:
   - `feat`: nueva funcionalidad
   - `fix`: corrección de bug
   - `docs`: documentación
   - `refactor`: mejora interna sin cambio funcional
   - `perf`: mejora de performance
   - `test`: pruebas
   - `chore`: mantenimiento/tarea técnica
   - `style`: formato/estilo sin cambios lógicos

4. Clasificar los cambios del repo por tipo de cambio antes de confirmar commit:
   - Sugerir separación en commits cuando haya mezcla (ejemplo: `feat` + `docs`).
   - Mostrar archivos por grupo para que el usuario confirme qué incluir en este commit.

5. Solicitar mensaje de commit usando formato Conventional Commits:
   - Formato: `<tipo>(<scope-opcional>): <resumen>`
   - Ejemplos:
     - `feat(observations): agregar filtro por actividad`
     - `fix(chronicle): corregir orden temporal en narrativa`
     - `docs(readme): documentar flujo de generación`

6. Confirmar staging y commit en una sola validación final:
   - Prompt: `Voy a ejecutar add/commit/push en <branch>. ¿Continuar? [s/n]`
   - Si confirma, ejecutar `git add` (selectivo o total según decisión previa), `git commit` y `git push`.
   - Si cancela, detener sin cambios adicionales.

7. Reportar resultado final:
   - Branch utilizada.
   - Tipo de cambio usado.
   - Hash corto del commit.
   - Estado de push (ok/error) y acción sugerida si falla.

## Notes

- Priorizar commits atómicos: un tipo de cambio principal por commit.
- Si el usuario elige rama actual, no abrir un nuevo prompt de selección de rama.
- Si no hay cambios staged/unstaged, abortar temprano con mensaje claro.
- No hacer push forzado (`--force`) salvo pedido explícito del usuario.
