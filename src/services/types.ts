
// Define all the interfaces used across the application

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profession: string;
  workHours: string;
  cancelPolicy: string;
  whatsappNumber: string;
  defaultMessage: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  feedbackStatus?: 'pending' | 'completed' | 'not_sent';
  userId?: string; // To associate client with specific user
}

export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  userId: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  date: string; // ISO format
  time: string;
  duration: number; // in minutes
  location: 'online' | 'in_person' | 'home_visit';
  status: 'scheduled' | 'confirmed' | 'canceled' | 'no_show' | 'completed';
  notes?: string;
  userId?: string; // To associate appointment with specific user
}

export interface FinancialRecord {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO format
  type: 'income' | 'expense';
  category?: string;
  relatedAppointment?: string;
  clientId?: string; // To associate with client
  userId?: string; // To associate financial record with specific user
  clientName?: string; // Add clientName property
  appointmentId?: string; // Add appointmentId property
  notes?: string; // Add notes property
}
