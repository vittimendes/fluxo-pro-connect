
import { AppointmentType } from './types';
import { appointmentTypesByUser } from './store';
import { generateUniqueId, getCurrentUserId } from './utils';

export const appointmentTypeService = {
  getAppointmentTypes: (userId?: string): Promise<AppointmentType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          userId = getCurrentUserId();
        }
        
        const userAppointmentTypes = appointmentTypesByUser[userId] || [];
        resolve([...userAppointmentTypes]);
      }, 500);
    });
  },

  addAppointmentType: (appointmentType: Omit<AppointmentType, 'id'>): Promise<AppointmentType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        
        const newAppointmentType = {
          ...appointmentType,
          id: generateUniqueId('type'),
          userId
        };
        
        if (!appointmentTypesByUser[userId]) {
          appointmentTypesByUser[userId] = [];
        }
        
        appointmentTypesByUser[userId].push(newAppointmentType);
        resolve(newAppointmentType);
      }, 500);
    });
  },

  updateAppointmentType: (id: string, data: Partial<AppointmentType>): Promise<AppointmentType> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        
        if (!appointmentTypesByUser[userId]) {
          reject(new Error('No appointment types found for this user'));
          return;
        }
        
        const index = appointmentTypesByUser[userId].findIndex(type => type.id === id);
        if (index !== -1) {
          appointmentTypesByUser[userId][index] = { ...appointmentTypesByUser[userId][index], ...data };
          resolve(appointmentTypesByUser[userId][index]);
        } else {
          reject(new Error('Appointment type not found'));
        }
      }, 500);
    });
  },

  deleteAppointmentType: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserId();
        
        if (!appointmentTypesByUser[userId]) {
          resolve(false);
          return;
        }
        
        const index = appointmentTypesByUser[userId].findIndex(type => type.id === id);
        if (index !== -1) {
          appointmentTypesByUser[userId].splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },
};
