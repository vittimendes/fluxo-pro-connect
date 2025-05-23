
// @file getAppointments.ts
// Provides functions for retrieving appointments with various filtering options
// (by user, date, week, client, etc.)

import { Appointment } from '../types';
import { appointmentsByUser } from '../store';
import { formatDate, getCurrentUserId } from '../utils';

// @api Get all appointments for a user
export const getAppointments = (userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    // @section Simulate API delay
    setTimeout(() => {
      if (!userId) {
        userId = getCurrentUserId();
      }
      
      const userAppointments = appointmentsByUser[userId] || [];
      resolve([...userAppointments]);
    }, 500);
  });
};

// @api Get only today's appointments
export const getTodayAppointments = (userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    const todayStr = formatDate(new Date());
    // @section Simulate API delay
    setTimeout(() => {
      if (!userId) {
        userId = getCurrentUserId();
      }
      
      const userAppointments = appointmentsByUser[userId] || [];
      const todayApps = userAppointments.filter(app => app.date === todayStr);
      resolve([...todayApps]);
    }, 500);
  });
};

// @api Get appointments for a specific date
export const getAppointmentsByDate = (date: string, userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    // @section Simulate API delay
    setTimeout(() => {
      if (!userId) {
        userId = getCurrentUserId();
      }
      
      const userAppointments = appointmentsByUser[userId] || [];
      const filteredApps = userAppointments.filter(app => app.date === date);
      resolve([...filteredApps]);
    }, 500);
  });
};

// @api Get appointments within a date range (inclusive)
export const getAppointmentsByWeek = (startDate: Date, endDate: Date, userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    // @section Simulate API delay
    setTimeout(() => {
      if (!userId) {
        userId = getCurrentUserId();
      }
      
      const start = formatDate(startDate);
      const end = formatDate(endDate);
      
      const userAppointments = appointmentsByUser[userId] || [];
      // @rule Filter appointments within date range
      const filteredApps = userAppointments.filter(app => {
        return app.date >= start && app.date <= end;
      });
      
      resolve([...filteredApps]);
    }, 500);
  });
};

// @api Get appointments for a specific client
export const getAppointmentsByClientId = (clientId: string, userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    // @section Simulate API delay
    setTimeout(() => {
      if (!userId) {
        userId = getCurrentUserId();
      }
      
      const userAppointments = appointmentsByUser[userId] || [];
      const clientAppointments = userAppointments.filter(app => app.clientId === clientId);
      
      resolve([...clientAppointments]);
    }, 500);
  });
};
