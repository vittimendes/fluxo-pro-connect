
/**
 * Standard form data interfaces for consistent data handling across the application
 */

// Client form data
export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  birthdate?: Date;
  notes?: string;
}

// Appointment form data
export interface AppointmentFormData {
  clientId: string;
  clientName: string; // Making this required
  type: string;
  date: Date | string; // Accept both Date and string
  time: string;
  duration: number | string;
  location: 'online' | 'in_person' | 'home_visit' | string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show'; // Define literal types
  notes?: string;
}

// Financial record form data
export interface FinancialRecordFormData {
  amount: string;
  description: string;
  date: Date;
  type: 'income' | 'expense' | string;
  category?: string;
  clientId?: string;
  relatedAppointment?: string;
}
