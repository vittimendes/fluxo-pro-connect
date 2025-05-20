
// @file Financeiro.tsx
// Financial management page that displays income, expenses,
// balances and transaction history.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FinancialRecord } from '@/services/types';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinancialSummaryCard } from '@/components/financial/FinancialSummaryCard';
import { FinancialPremiumFeatures } from '@/components/financial/FinancialPremiumFeatures';
import { FinancialTransactionTabs } from '@/components/financial/FinancialTransactionTabs';
import { FinancialFilters } from '@/components/financial/FinancialFilters';
import { financialService } from '@/services/financialService';
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';

const Financeiro = () => {
  // @section State management
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
  const navigate = useNavigate();
  const { toast } = useToast();

  // @effect Load financial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // @api Get financial records
        const financialRecords = await financialService.getFinancialRecords();
        
        // @section Sort records by date (newest first)
        const sortedRecords = [...financialRecords].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setRecords(sortedRecords);
        
        // Apply initial filters
        filterRecords(sortedRecords, selectedClientId, selectedPeriod, dateRange);
        
        // @event Show success toast
        toast({
          title: "Dados carregados",
          description: "Registros financeiros atualizados.",
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
        // @event Show error toast
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

  // Filter records based on client and period
  const filterRecords = (
    allRecords: FinancialRecord[],
    clientId: string | null,
    period: 'current' | 'custom' | 'all',
    range: DateRange | undefined
  ) => {
    // First filter by client if selected
    let filtered = allRecords;
    
    if (clientId) {
      filtered = filtered.filter(record => record.clientId === clientId);
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
  
  // Handle client filter change
  const handleClientChange = (clientId: string | null) => {
    setSelectedClientId(clientId);
    filterRecords(records, clientId, selectedPeriod, dateRange);
  };
  
  // Handle period filter change
  const handlePeriodChange = (period: 'current' | 'custom' | 'all') => {
    setSelectedPeriod(period);
    filterRecords(records, selectedClientId, period, dateRange);
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    filterRecords(records, selectedClientId, selectedPeriod, range);
  };

  return (
    <div className="space-y-6">
      {/* @section Page header with title and new record button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Financeiro</h2>
        <Button onClick={() => navigate('/financeiro/novo')}>
          <Plus className="h-4 w-4 mr-1" /> 
          <span className="hidden sm:inline">Novo Registro</span>
        </Button>
      </div>

      {/* @component Financial summary display */}
      <FinancialSummaryCard summary={summary} />
      
      {/* @component Filters */}
      <FinancialFilters
        selectedClientId={selectedClientId}
        selectedPeriod={selectedPeriod}
        dateRange={dateRange}
        onClientChange={handleClientChange}
        onPeriodChange={handlePeriodChange}
        onDateRangeChange={handleDateRangeChange}
      />
      
      {/* @component Premium features promotion */}
      <FinancialPremiumFeatures />

      {/* @component Transactions list with tabs */}
      <FinancialTransactionTabs 
        records={filteredRecords}
        loading={loading}
      />
    </div>
  );
};

export default Financeiro;
