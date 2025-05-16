
import { Appointment } from '../types';
import { appointmentsByUser } from '../store';
import { formatDate, getCurrentUserId } from '../utils';

export const getAppointments = (userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!userId) {
        userId = getCurrentUserId();
      }
      
      const userAppointments = appointmentsByUser[userId] || [];
      resolve([...userAppointments]);
    }, 500);
  });
};

export const getTodayAppointments = (userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    const todayStr = formatDate(new Date());
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

export const getAppointmentsByDate = (date: string, userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
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

export const getAppointmentsByWeek = (startDate: Date, endDate: Date, userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!userId) {
        userId = getCurrentUserId();
      }
      
      const start = formatDate(startDate);
      const end = formatDate(endDate);
      
      const userAppointments = appointmentsByUser[userId] || [];
      const filteredApps = userAppointments.filter(app => {
        return app.date >= start && app.date <= end;
      });
      
      resolve([...filteredApps]);
    }, 500);
  });
};

export const getAppointmentsByClientId = (clientId: string, userId?: string): Promise<Appointment[]> => {
  return new Promise((resolve) => {
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
