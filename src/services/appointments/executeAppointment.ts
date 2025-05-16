
import { Appointment, FinancialRecord } from '../types';
import { appointmentsByUser, financialRecordsByUser } from '../store';
import { generateUniqueId, formatDate, getCurrentUserId } from '../utils';

export const executeAppointment = (id: string, financialData?: { amount: number, description: string, type: 'income' | 'expense' }): Promise<{ appointment: Appointment, financialRecord?: FinancialRecord }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userId = getCurrentUserId();
      
      if (!appointmentsByUser[userId]) {
        reject(new Error('No appointments found for this user'));
        return;
      }
      
      // Update appointment status to completed
      const index = appointmentsByUser[userId].findIndex(app => app.id === id);
      if (index === -1) {
        reject(new Error('Appointment not found'));
        return;
      }
      
      appointmentsByUser[userId][index] = { 
        ...appointmentsByUser[userId][index], 
        status: 'completed' 
      };
      
      const updatedAppointment = appointmentsByUser[userId][index];
      
      // Create a financial record if data is provided
      if (financialData) {
        const newRecord: FinancialRecord = {
          id: generateUniqueId('fin'),
          amount: financialData.amount,
          description: financialData.description,
          date: formatDate(new Date()),
          type: financialData.type,
          relatedAppointment: id,
          userId
        };
        
        if (!financialRecordsByUser[userId]) {
          financialRecordsByUser[userId] = [];
        }
        
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
