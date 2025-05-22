import { z } from 'zod';

// Client form validation schema
export const clientFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  notes: z.string().optional(),
  birthdate: z.date({
    required_error: "Data de nascimento é obrigatória",
  }).refine(date => date instanceof Date && !isNaN(date.getTime()), {
    message: "Data de nascimento inválida"
  }),
});

// Type for form values derived from the schema
export type ClientFormValues = z.infer<typeof clientFormSchema>;
