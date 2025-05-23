
import { FinancialRecord } from './types';
import { financialRecordsByUser } from './store';
import { generateUniqueId, getCurrentUserIdSync } from './utils';

export const financialService = {
  getFinancialRecords: (userId?: string): Promise<FinancialRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          userId = getCurrentUserIdSync();
        }
        
        const userRecords = financialRecordsByUser[userId] || [];
        resolve([...userRecords]);
      }, 500);
    });
  },

  getFinancialRecordById: (id: string): Promise<FinancialRecord | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        const userRecords = financialRecordsByUser[userId] || [];
        const record = userRecords.find(record => record.id === id);
        
        resolve(record || null);
      }, 500);
    });
  },

  getMonthlyFinancialSummary: (month: number, year: number, userId?: string): Promise<{ income: number, expenses: number, balance: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          userId = getCurrentUserIdSync();
        }
        
        const userRecords = financialRecordsByUser[userId] || [];
        const records = userRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === month && recordDate.getFullYear() === year;
        });
        
        const income = records
          .filter(record => record.type === 'income')
          .reduce((sum, record) => sum + record.amount, 0);
          
        const expenses = records
          .filter(record => record.type === 'expense')
          .reduce((sum, record) => sum + Math.abs(record.amount), 0);
        
        resolve({
          income,
          expenses,
          balance: income - expenses
        });
      }, 500);
    });
  },

  getFinancialRecordsByClientId: (clientId: string, userId?: string): Promise<FinancialRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          userId = getCurrentUserIdSync();
        }
        
        const userRecords = financialRecordsByUser[userId] || [];
        const clientRecords = userRecords.filter(record => record.clientId === clientId);
        
        resolve([...clientRecords]);
      }, 500);
    });
  },

  getFinancialRecordsByAppointment: (appointmentId: string, userId?: string): Promise<FinancialRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userId) {
          userId = getCurrentUserIdSync();
        }
        
        const userRecords = financialRecordsByUser[userId] || [];
        const filteredRecords = userRecords.filter(
          record => record.relatedAppointment === appointmentId
        );
        
        resolve([...filteredRecords]);
      }, 500);
    });
  },

  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>): Promise<FinancialRecord> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        
        const newRecord = {
          ...record,
          id: generateUniqueId('fin'),
          userId
        };
        
        if (!financialRecordsByUser[userId]) {
          financialRecordsByUser[userId] = [];
        }
        
        financialRecordsByUser[userId].push(newRecord);
        resolve(newRecord);
      }, 500);
    });
  },

  updateFinancialRecord: (id: string, data: Partial<FinancialRecord>): Promise<FinancialRecord> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        
        if (!financialRecordsByUser[userId]) {
          reject(new Error('No financial records found for this user'));
          return;
        }
        
        const index = financialRecordsByUser[userId].findIndex(record => record.id === id);
        if (index !== -1) {
          financialRecordsByUser[userId][index] = { ...financialRecordsByUser[userId][index], ...data };
          resolve(financialRecordsByUser[userId][index]);
        } else {
          reject(new Error('Financial record not found'));
        }
      }, 500);
    });
  },

  deleteFinancialRecord: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = getCurrentUserIdSync();
        
        if (!financialRecordsByUser[userId]) {
          resolve(false);
          return;
        }
        
        const index = financialRecordsByUser[userId].findIndex(record => record.id === id);
        if (index !== -1) {
          financialRecordsByUser[userId].splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },
};
