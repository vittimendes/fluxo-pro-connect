
// @file appointmentService.ts
// Provides a unified service interface for appointment operations
// by using the repository pattern for appointment management.

import { appointmentRepository } from '@/repositories/appointmentRepository';

// Define type for status
type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';

// @api Export all functions as a unified service object
export const appointmentService = {
  // Get appointment functions
  getAppointments: () => appointmentRepository.getAll(),
  getTodayAppointments: (date: Date) => appointmentRepository.getByDate(date),
  getAppointmentsByDate: (date: Date) => appointmentRepository.getByDate(date),
  getAppointmentsByWeek: (startDate: Date, endDate: Date) => 
    appointmentRepository.getByDateRange(startDate, endDate),
  getAppointmentsByClientId: (clientId: string) => 
    appointmentRepository.getByClientId(clientId),
  
  // Modify appointment functions  
  addAppointment: (appointment: any) => appointmentRepository.create(appointment),
  updateAppointment: (id: string, updates: any) => appointmentRepository.update(id, updates),
  deleteAppointment: (id: string) => appointmentRepository.delete(id),
  
  // Execute appointment function
  executeAppointment: async (id: string, status: string, notes?: string) => {
    try {
      return await appointmentRepository.update(id, { 
        status: status as AppointmentStatus, // Cast to specific type
        notes 
      });
    } catch (error) {
      console.error("Error executing appointment:", error);
      throw error;
    }
  }
};
