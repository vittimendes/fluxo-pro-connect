
// Re-export all appointment services from the refactored modules
import { 
  getAppointments,
  getTodayAppointments,
  getAppointmentsByDate,
  getAppointmentsByWeek,
  getAppointmentsByClientId
} from './appointments/getAppointments';

import {
  addAppointment,
  updateAppointment,
  deleteAppointment
} from './appointments/modifyAppointments';

import { 
  executeAppointment 
} from './appointments/executeAppointment';

// Export all as a single service object
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
