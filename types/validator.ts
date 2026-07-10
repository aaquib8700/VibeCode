export interface ValidationError {
  type: string;
  file: string;
  message: string;
  value?: string;
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
}
