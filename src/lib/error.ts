export type ErrorCode =
  | "FIELD_KEY_TAKEN"
  | "FIELD_NOT_FOUND"
  | "FIELD_ARCHIVE_FAILED"
  | "FIELD_RESTORE_FAILED"
  | "FORM_NAME_TAKEN"
  | "FORM_NOT_FOUND"
  | "FORM_ARCHIVE_FAILED"
  | "FORM_RESTORE_FAILED"
  | "UNKNOWN_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
