
// Change the re-export to use 'export type'
import { User } from '../types/user';

export type { User };

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
  notes?: string;
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
  appointmentId?: string;
  clientId?: string;
  clientName?: string;
  notes?: string;
}
