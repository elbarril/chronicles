import { type FieldType } from "@/domain/field";

export const fieldTypeLabel: Record<FieldType, string> = {
  text: "Texto corto",
  longText: "Texto largo",
  number: "Número",
  boolean: "Sí/No",
  singleChoice: "Selección única",
  multiChoice: "Selección múltiple",
  date: "Fecha",
  time: "Hora",
  datetime: "Fecha y hora",
  image: "Imagen",
  video: "Video",
  audio: "Audio",
  file: "Archivo",
  rating: "Escala",
  location: "Ubicación",
};
