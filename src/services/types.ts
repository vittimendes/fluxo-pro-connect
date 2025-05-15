export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profession?: string;
  workHours?: string;
  cancelPolicy?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  plan?: 'free' | 'pro'; // Added plan property
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  feedbackStatus: 'not_sent' | 'pending' | 'completed';
  userId: string;
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
  date: string;
  time: string;
  duration: number;
  location: 'online' | 'in_person' | 'home_visit' | string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
  userId: string;
}

export interface FinancialRecord {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category?: string;
  userId: string;
  relatedAppointment?: string;
  appointmentId?: string; // Added property
  clientId?: string; // Added property
  clientName?: string; // Added property
  notes?: string; // Added property
}
