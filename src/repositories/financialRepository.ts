
import { BaseRepository } from '@/lib/repository';
import { FinancialRepository as IFinancialRepository } from '@/types/repository';
import { FinancialRecord } from '@/services/types';
import { financialRecordsByUser } from '@/services/store';
import { generateUniqueId, getCurrentUserId } from '@/services/utils';
import { format } from 'date-fns';

export class FinancialRepository extends BaseRepository<FinancialRecord> implements IFinancialRepository<FinancialRecord> {
  protected getStore() {
    return financialRecordsByUser;
  }
  
  protected generateId(): string {
    return generateUniqueId('fin');
  }
  
  async getByPeriod(startDate: Date, endDate: Date, userId?: string): Promise<FinancialRecord[]> {
    if (!userId) {
      userId = getCurrentUserId();
    }
    
    const allRecords = await this.getAllByUserId(userId);
    
    return allRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }
  
  async getByClientId(clientId: string, userId?: string): Promise<FinancialRecord[]> {
    if (!userId) {
      userId = getCurrentUserId();
    }
    
    const allRecords = await this.getAllByUserId(userId);
    return allRecords.filter(record => record.clientId === clientId);
  }
  
  async getByCategory(category: string, userId?: string): Promise<FinancialRecord[]> {
    if (!userId) {
      userId = getCurrentUserId();
    }
    
    const allRecords = await this.getAllByUserId(userId);
    return allRecords.filter(record => record.category === category);
  }
  
  async getSummary(startDate: Date, endDate: Date, userId?: string): Promise<{ income: number, expenses: number, balance: number }> {
    if (!userId) {
      userId = getCurrentUserId();
    }
    
    const records = await this.getByPeriod(startDate, endDate, userId);
    
    const income = records
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.amount, 0);
      
    const expenses = records
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + Math.abs(record.amount), 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }
}

// Create singleton instance
export const financialRepository = new FinancialRepository();
