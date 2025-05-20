
import { useState, useEffect } from 'react';
import { FinancialRecord } from '@/services/types';
import { financialService } from '@/services/financialService';
import { filterFinancialRecords } from '@/utils/financialUtils';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

export const useFinancialData = () => {
  // State management
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'custom' | 'all'>('current');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get financial records
        const financialRecords = await financialService.getFinancialRecords();
        
        // Sort records by date (newest first)
        const sortedRecords = [...financialRecords].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setRecords(sortedRecords);
        
        // Extract unique categories
        const categories = new Set<string>();
        sortedRecords.forEach(record => {
          if (record.category) {
            categories.add(record.category);
          }
        });
        setAvailableCategories(Array.from(categories));
        
        // Apply initial filters
        applyFilters(sortedRecords, selectedClientId, selectedCategory, selectedPeriod, dateRange);
        
        toast({
          title: "Dados carregados",
          description: "Registros financeiros atualizados.",
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast({
          title: "Erro ao carregar dados financeiros",
          description: "Não foi possível carregar seus registros financeiros.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Apply filters and update filtered records and summary
  const applyFilters = (
    allRecords: FinancialRecord[],
    clientId: string | null,
    category: string | null,
    period: 'current' | 'custom' | 'all',
    range: DateRange | undefined
  ) => {
    const filtered = filterFinancialRecords(allRecords, clientId, category, period, range);
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
  };
  
  // Handler functions
  const handleClientChange = (clientId: string | null) => {
    setSelectedClientId(clientId);
    applyFilters(records, clientId, selectedCategory, selectedPeriod, dateRange);
  };
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    applyFilters(records, selectedClientId, category, selectedPeriod, dateRange);
  };
  
  const handlePeriodChange = (period: 'current' | 'custom' | 'all') => {
    setSelectedPeriod(period);
    applyFilters(records, selectedClientId, selectedCategory, period, dateRange);
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    applyFilters(records, selectedClientId, selectedCategory, selectedPeriod, range);
  };

  const handleClearFilters = () => {
    setSelectedClientId(null);
    setSelectedCategory(null);
    setSelectedPeriod('current');
    setDateRange(undefined);
    applyFilters(records, null, null, 'current', undefined);
  };

  return {
    records: filteredRecords,
    loading,
    summary,
    selectedClientId,
    selectedCategory,
    selectedPeriod,
    dateRange,
    availableCategories,
    handleClientChange,
    handleCategoryChange,
    handlePeriodChange,
    handleDateRangeChange,
    handleClearFilters
  };
};
