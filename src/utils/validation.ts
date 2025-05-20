
import { z } from 'zod';

// Define a type for the validation result with errors
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: { [key: string]: string } };

// Create a schema for financial record form data
export const financialRecordSchema = z.object({
  amount: z.string().min(1, "O valor é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  category: z.string().optional(),
  clientId: z.string().optional(),
  relatedAppointment: z.string().optional(),
});

// Create a schema for client form data
export const clientSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(8, "O telefone deve ter pelo menos 8 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  notes: z.string().optional(),
  birthdate: z.date().optional(),
});

// Generic validation function
export function validate<T>(schema: z.Schema<T>, data: any): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: { [key: string]: string } = {};
      
      error.errors.forEach(err => {
        if (err.path.length > 0) {
          errors[err.path.join('.')] = err.message;
        }
      });
      
      return { success: false, errors };
    }
    
    return { 
      success: false, 
      errors: { _general: 'Ocorreu um erro na validação' } 
    };
  }
}
