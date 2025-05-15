
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profession?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  workHours?: string;
  cancelPolicy?: string;
  plan?: "free" | "pro";
}
