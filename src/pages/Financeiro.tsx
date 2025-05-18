
// @file Financeiro.tsx
// Financial management page that displays income, expenses,
// balances and transaction history.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FinancialRecord, mockDataService } from '@/services/mockData';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinancialSummaryCard } from '@/components/financial/FinancialSummaryCard';
import { FinancialPremiumFeatures } from '@/components/financial/FinancialPremiumFeatures';
import { FinancialTransactionTabs } from '@/components/financial/FinancialTransactionTabs';

const Financeiro = () => {
  // @section State management
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // @effect Load financial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // @api Get financial records
        const financialRecords = await mockDataService.getFinancialRecords();
        
        // @section Sort records by date (newest first)
        const sortedRecords = [...financialRecords].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setRecords(sortedRecords);

        // @api Get current month's summary
        const currentDate = new Date();
        const monthlySummary = await mockDataService.getMonthlyFinancialSummary(
          currentDate.getMonth(),
          currentDate.getFullYear()
        );
        setSummary(monthlySummary);
        
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
      
      {/* @component Premium features promotion */}
      <FinancialPremiumFeatures />

      {/* @component Transactions list with tabs */}
      <FinancialTransactionTabs 
        records={records}
        loading={loading}
      />
    </div>
  );
};

export default Financeiro;
