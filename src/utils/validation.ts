
import { z } from 'zod';

// Client validation schema
export const clientSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido").or(z.string().length(0)),
  phone: z.string().min(10, "Número de telefone inválido"),
  birthdate: z.date().optional(),
  notes: z.string().optional()
});

// Appointment validation schema
export const appointmentSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório"),
  type: z.string().min(1, "Tipo de consulta é obrigatório"),
  date: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  duration: z.number().min(1, "Duração inválida"),
  location: z.union([
    z.literal('online'),
    z.literal('in_person'),
    z.literal('home_visit'),
    z.string()
  ]),
  status: z.union([
    z.literal('scheduled'),
    z.literal('confirmed'),
    z.literal('completed'),
    z.literal('canceled'),
    z.literal('no_show')
  ]),
  notes: z.string().optional()
});

// Financial record validation schema
export const financialRecordSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor inválido"),
  description: z.string().min(3, "Descrição é obrigatória"),
  date: z.date(),
  type: z.union([z.literal("income"), z.literal("expense"), z.string()]),
  category: z.string().optional(),
  clientId: z.string().optional(),
  relatedAppointment: z.string().optional()
});

// Validate function
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: { [key: string]: string } } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: { [key: string]: string } = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          formattedErrors[err.path[0].toString()] = err.message;
        }
      });
      return { success: false, errors: formattedErrors };
    }
    throw error;
  }
}
