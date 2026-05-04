export const formMessages = {
  createdSuccess: "Formulario creado.",
  createError: "No pudimos crear el formulario.",
  updatedSuccess: "Formulario actualizado.",
  updateError: "No pudimos actualizar el formulario.",
  archivedSuccess: "Formulario archivado.",
  archiveError: "No pudimos archivar el formulario.",
  restoredSuccess: "Formulario restaurado.",
  restoreError: "No pudimos restaurar el formulario.",
  deletedSuccess: "Formulario eliminado.",
  deleteError: "No pudimos eliminar el formulario.",
  deleteNotArchived: "Solo podés eliminar formularios archivados.",
  nameAlreadyTaken: "Ya existe un formulario con ese nombre.",
  notFound: "No encontramos el formulario.",
  emptyFields: "Agregá al menos un campo antes de guardar.",
  confirmDeleteTitle: "¿Eliminar formulario?",
  confirmDeleteDescription:
    "Esta acción es permanente. Se eliminarán también todas las observaciones (y los archivos multimedia y crónicas asociadas) que usaban este formulario.",
} as const;
