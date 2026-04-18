import { type FieldConfig, type FieldFormInput, type FieldType } from "@/domain/field";

export function getDefaultConfig(type: FieldType): FieldConfig {
  switch (type) {
    case "text":
    case "longText":
      return { maxLength: undefined };
    case "number":
      return { min: undefined, max: undefined };
    case "boolean":
    case "location":
      return {};
    case "singleChoice":
      return { options: ["Opción 1"] };
    case "multiChoice":
      return { options: ["Opción 1"], minSelect: undefined, maxSelect: undefined };
    case "date":
    case "time":
    case "datetime":
      return { min: undefined, max: undefined };
    case "image":
    case "video":
    case "audio":
    case "file":
      return { accept: undefined, multiple: false };
    case "rating":
      return { min: 1, max: 5, step: 1 };
    default:
      return {};
  }
}

export function getDefaultFieldInput(type: FieldType = "text"): FieldFormInput {
  return {
    label: "",
    key: "",
    type,
    required: false,
    helpText: "",
    config: getDefaultConfig(type),
  } as FieldFormInput;
}
