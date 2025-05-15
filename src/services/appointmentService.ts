
import { Appointment, FinancialRecord } from './types';
import { appointmentsByUser, financialRecordsByUser } from './mockStore';
import { generateUniqueId, formatDate, getCurrentUserId } from './utils';

export const appointmentService = {
  getAppointments: (userId?: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          userId = getCurrentUserId();
        }
        
        const userAppointments = appointmentsByUser[userId] || [];
        resolve([...userAppointments]);
      }, 500);
    });
  },

  getTodayAppointments: (userId?: string): Promise<Appointment[]> => {
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
  },

  getAppointmentsByDate: (date: string, userId?: string): Promise<Appointment[]> => {
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
  },

  getAppointmentsByWeek: (startDate: Date, endDate: Date, userId?: string): Promise<Appointment[]> => {
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
  },

  getAppointmentsByClientId: (clientId: string, userId?: string): Promise<Appointment[]> => {
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
  },

  addAppointment: (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
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
  },

  updateAppointment: (id: string, data: Partial<Appointment>): Promise<Appointment> => {
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
  },

  deleteAppointment: (id: string): Promise<boolean> => {
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
  },
  
  executeAppointment: (id: string, financialData?: { amount: number, description: string, type: 'income' | 'expense' }): Promise<{ appointment: Appointment, financialRecord?: FinancialRecord }> => {
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
  },
};
