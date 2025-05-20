
import { useState, useEffect } from 'react';
import { FinancialRecord } from '@/services/types';
import { filterFinancialRecords } from '@/utils/financialUtils';
import { DateRange } from 'react-day-picker';

export const useFinancialFilters = (
  allRecords: FinancialRecord[],
  selectedClientId: string | null,
  selectedCategory: string | null,
  selectedPeriod: 'current' | 'custom' | 'all',
  dateRange: DateRange | undefined
) => {
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });

  // Apply filters whenever filter criteria or records change
  useEffect(() => {
    const filtered = filterFinancialRecords(
      allRecords,
      selectedClientId,
      selectedCategory,
      selectedPeriod,
      dateRange
    );
    
    setFilteredRecords(filtered);
    
    // Calculate new summary based on filtered records
    const income = filtered
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.amount, 0);
      
    const expenses = filtered
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + Math.abs(record.amount), 0);
    
    setSummary({
      income,
      expenses,
      balance: income - expenses
    });
  }, [allRecords, selectedClientId, selectedCategory, selectedPeriod, dateRange]);

  return {
    filteredRecords,
    summary
  };
};
