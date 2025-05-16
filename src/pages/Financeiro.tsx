
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
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get financial records
        const financialRecords = await mockDataService.getFinancialRecords();
        
        // Sort records by date (newest first)
        const sortedRecords = [...financialRecords].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setRecords(sortedRecords);

        // Get current month's summary
        const currentDate = new Date();
        const monthlySummary = await mockDataService.getMonthlyFinancialSummary(
          currentDate.getMonth(),
          currentDate.getFullYear()
        );
        setSummary(monthlySummary);
        
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Financeiro</h2>
        <Button onClick={() => navigate('/financeiro/novo')}>
          <Plus className="h-4 w-4 mr-1" /> Novo Registro
        </Button>
      </div>

      {/* Financial Summary */}
      <FinancialSummaryCard summary={summary} />
      
      {/* Premium Features */}
      <FinancialPremiumFeatures />

      {/* Transactions List */}
      <FinancialTransactionTabs 
        records={records}
        loading={loading}
      />
    </div>
  );
};

export default Financeiro;
