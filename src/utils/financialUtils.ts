
import { FinancialRecord } from '@/services/types';
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';

export const filterFinancialRecords = (
  allRecords: FinancialRecord[],
  clientId: string | null,
  category: string | null,
  period: 'current' | 'custom' | 'all',
  range: DateRange | undefined
): FinancialRecord[] => {
  // First filter by client if selected
  let filtered = [...allRecords];
  
  if (clientId) {
    if (clientId === 'no-client') {
      // Filter records with no client associated
      filtered = filtered.filter(record => !record.clientId);
    } else {
      // Filter records for a specific client
      filtered = filtered.filter(record => record.clientId === clientId);
    }
  }
  
  // Then filter by category if selected
  if (category) {
    filtered = filtered.filter(record => record.category === category);
  }
  
  // Then filter by period
  if (period === 'current') {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth && 
        recordDate.getFullYear() === currentYear
      );
    });
  } else if (period === 'custom' && range?.from && range?.to) {
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.date);
      return isWithinInterval(recordDate, {
        start: range.from,
        end: range.to
      });
    });
  }
  // 'all' period means no date filtering
  
  return filtered;
};

export const calculateFinancialSummary = (records: FinancialRecord[]) => {
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
};
