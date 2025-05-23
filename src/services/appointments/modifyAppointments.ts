
// @file modifyAppointments.ts
// Provides CRUD operations for appointment management including adding,
// updating, and deleting appointments in the data store.

import { Appointment } from '../types';
import { appointmentsByUser } from '../store';
import { generateUniqueId, getCurrentUserIdSync } from '../utils';

// @api Add a new appointment to the data store
export const addAppointment = (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
  return new Promise((resolve) => {
    // @section Simulate API delay
    setTimeout(() => {
      const userId = getCurrentUserIdSync();
      
      // @section Create new appointment with generated ID
      const newAppointment = {
        ...appointment,
        id: generateUniqueId('app'),
        userId
      };
      
      // @section Initialize user's appointment array if needed
      if (!appointmentsByUser[userId]) {
        appointmentsByUser[userId] = [];
      }
      
      // @section Add new appointment to store
      appointmentsByUser[userId].push(newAppointment);
      resolve(newAppointment);
    }, 500);
  });
};

// @api Update an existing appointment in the data store
export const updateAppointment = (id: string, data: Partial<Appointment>): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    // @section Simulate API delay
    setTimeout(() => {
      const userId = getCurrentUserIdSync();
      
      // @rule Check if user has any appointments
      if (!appointmentsByUser[userId]) {
        reject(new Error('No appointments found for this user'));
        return;
      }
      
      // @section Find and update the appointment
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

// @api Delete an appointment from the data store
export const deleteAppointment = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // @section Simulate API delay
    setTimeout(() => {
      const userId = getCurrentUserIdSync();
      
      // @rule Check if user has any appointments
      if (!appointmentsByUser[userId]) {
        resolve(false);
        return;
      }
      
      // @section Find and remove the appointment
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
