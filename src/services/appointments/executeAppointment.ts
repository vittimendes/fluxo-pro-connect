
// @file executeAppointment.ts
// Handles the business logic for marking an appointment as completed
// and optionally creating an associated financial record.

import { Appointment, FinancialRecord } from '../types';
import { appointmentsByUser, financialRecordsByUser } from '../store';
import { generateUniqueId, formatDate, getCurrentUserIdSync } from '../utils';

// @api Mark an appointment as executed/completed and optionally create a financial record
export const executeAppointment = (id: string, financialData?: { amount: number, description: string, type: 'income' | 'expense' }): Promise<{ appointment: Appointment, financialRecord?: FinancialRecord }> => {
  return new Promise((resolve, reject) => {
    // @section Simulate API delay
    setTimeout(() => {
      const userId = getCurrentUserIdSync();
      
      // @rule Check if user has any appointments
      if (!appointmentsByUser[userId]) {
        reject(new Error('No appointments found for this user'));
        return;
      }
      
      // @section Update appointment status to completed
      const index = appointmentsByUser[userId].findIndex(app => app.id === id);
      if (index === -1) {
        reject(new Error('Appointment not found'));
        return;
      }
      
      // @section Mark the appointment as completed
      appointmentsByUser[userId][index] = { 
        ...appointmentsByUser[userId][index], 
        status: 'completed' 
      };
      
      const updatedAppointment = appointmentsByUser[userId][index];
      
      // @section Create a financial record if data is provided
      if (financialData) {
        // @section Generate and store new financial record
        const newRecord: FinancialRecord = {
          id: generateUniqueId('fin'),
          amount: financialData.amount,
          description: financialData.description,
          date: formatDate(new Date()),
          type: financialData.type,
          relatedAppointment: id,
          userId
        };
        
        // @section Initialize user's financial records array if needed
        if (!financialRecordsByUser[userId]) {
          financialRecordsByUser[userId] = [];
        }
        
        // @section Add new financial record to store
        financialRecordsByUser[userId].push(newRecord);
        
        resolve({
          appointment: updatedAppointment,
          financialRecord: newRecord
        });
      } else {
        resolve({
          appointment: updatedAppointment
        });
      }
    }, 500);
  });
};
