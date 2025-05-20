
// Add to the existing validation.ts file or create it if it doesn't exist
import { z } from 'zod';
import { FinancialRecordFormData } from '@/types/forms';

// Schema for financial record form validation
export const financialRecordSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.date({
    required_error: "Data é obrigatória",
    invalid_type_error: "Data inválida",
  }),
  type: z.enum(["income", "expense"], {
    required_error: "Tipo é obrigatório",
    invalid_type_error: "Tipo inválido",
  }),
  category: z.string().optional(),
  clientId: z.string().optional(),
  relatedAppointment: z.string().optional(),
});

// Type definitions for validation results
export type ValidationSuccess<T> = {
  success: true;
  data: T;
};

export type ValidationError = {
  success: false;
  errors: { [key: string]: string };
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

// Generic validation function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    const formattedErrors: { [key: string]: string } = {};
    result.error.errors.forEach((err) => {
      const path = err.path.join(".");
      formattedErrors[path] = err.message;
    });
    
    return {
      success: false,
      errors: formattedErrors,
    };
  }
}
