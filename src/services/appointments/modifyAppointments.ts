
import { Appointment } from '../types';
import { appointmentsByUser } from '../store';
import { generateUniqueId, getCurrentUserId } from '../utils';

export const addAppointment = (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userId = getCurrentUserId();
      
      const newAppointment = {
        ...appointment,
        id: generateUniqueId('app'),
        userId
      };
      
      if (!appointmentsByUser[userId]) {
        appointmentsByUser[userId] = [];
      }
      
      appointmentsByUser[userId].push(newAppointment);
      resolve(newAppointment);
    }, 500);
  });
};

export const updateAppointment = (id: string, data: Partial<Appointment>): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userId = getCurrentUserId();
      
      if (!appointmentsByUser[userId]) {
        reject(new Error('No appointments found for this user'));
        return;
      }
      
      const index = appointmentsByUser[userId].findIndex(app => app.id === id);
      if (index !== -1) {
        appointmentsByUser[userId][index] = { ...appointmentsByUser[userId][index], ...data };
        resolve(appointmentsByUser[userId][index]);
      } else {
        reject(new Error('Appointment not found'));
      }
    }, 500);
  });
};

export const deleteAppointment = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userId = getCurrentUserId();
      
      if (!appointmentsByUser[userId]) {
        resolve(false);
        return;
      }
      
      const index = appointmentsByUser[userId].findIndex(app => app.id === id);
      if (index !== -1) {
        appointmentsByUser[userId].splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
