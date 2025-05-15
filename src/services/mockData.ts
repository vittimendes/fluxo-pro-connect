
// Re-export all types and services from a single file
// This maintains backwards compatibility

export * from './types';
export * from './utils';
export { mockAuthService } from './authService';

// Create a combined service object to maintain the existing API
import { clientService } from './clientService';
import { appointmentTypeService } from './appointmentTypeService';
import { appointmentService } from './appointmentService';
import { financialService } from './financialService';
import { attachmentService } from './attachmentService';

// Combine all services into a single mockDataService object
export const mockDataService = {
  // Client methods
  getClients: clientService.getClients,
  getClientById: clientService.getClientById,
  addClient: clientService.addClient,
  updateClient: clientService.updateClient,
  deleteClient: clientService.deleteClient,

  // Appointment types methods
  getAppointmentTypes: appointmentTypeService.getAppointmentTypes,
  addAppointmentType: appointmentTypeService.addAppointmentType,
  updateAppointmentType: appointmentTypeService.updateAppointmentType,
  deleteAppointmentType: appointmentTypeService.deleteAppointmentType,

  // Appointment methods
  getAppointments: appointmentService.getAppointments,
  getTodayAppointments: appointmentService.getTodayAppointments,
  getAppointmentsByDate: appointmentService.getAppointmentsByDate,
  getAppointmentsByWeek: appointmentService.getAppointmentsByWeek,
  getAppointmentsByClientId: appointmentService.getAppointmentsByClientId,
  addAppointment: appointmentService.addAppointment,
  updateAppointment: appointmentService.updateAppointment,
  deleteAppointment: appointmentService.deleteAppointment,
  executeAppointment: appointmentService.executeAppointment,

  // Financial record methods
  getFinancialRecords: financialService.getFinancialRecords,
  getFinancialRecordById: financialService.getFinancialRecordById,
  getMonthlyFinancialSummary: financialService.getMonthlyFinancialSummary,
  getFinancialRecordsByClientId: financialService.getFinancialRecordsByClientId,
  getFinancialRecordsByAppointment: financialService.getFinancialRecordsByAppointment,
  addFinancialRecord: financialService.addFinancialRecord,
  updateFinancialRecord: financialService.updateFinancialRecord,
  deleteFinancialRecord: financialService.deleteFinancialRecord,
  
  // Attachment methods
  getAttachmentsByClientId: attachmentService.getAttachmentsByClientId,
  addAttachment: attachmentService.addAttachment,
  deleteAttachment: attachmentService.deleteAttachment,
};
