
// @file appointmentService.ts
// Provides a unified service interface for appointment operations
// by re-exporting functionality from modular appointment service files.

// @section Import appointment getter functions
import { 
  getAppointments,
  getTodayAppointments,
  getAppointmentsByDate,
  getAppointmentsByWeek,
  getAppointmentsByClientId
} from './appointments/getAppointments';

// @section Import appointment modification functions
import {
  addAppointment,
  updateAppointment,
  deleteAppointment
} from './appointments/modifyAppointments';

// @section Import appointment execution function
import { 
  executeAppointment 
} from './appointments/executeAppointment';

// @api Export all functions as a unified service object
export const appointmentService = {
  getAppointments,
  getTodayAppointments,
  getAppointmentsByDate,
  getAppointmentsByWeek,
  getAppointmentsByClientId,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  executeAppointment
};
