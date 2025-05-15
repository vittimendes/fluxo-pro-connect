
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FinancialRecord, mockDataService } from '@/services/mockData';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, TrendingUp, TrendingDown, Calendar, Lock, Download, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Format amount to display as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Financeiro</h2>
        <Button onClick={() => navigate('/financeiro/novo')}>
          <Plus className="h-4 w-4 mr-1" /> Novo Registro
        </Button>
      </div>

      {/* Financial Summary */}
      <Card className="shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resumo Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Receitas</p>
              <p className="text-green-600 font-semibold">
                {formatCurrency(summary.income)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Despesas</p>
              <p className="text-red-600 font-semibold">
                {formatCurrency(summary.expenses)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Saldo</p>
              <p className={`font-semibold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Premium Features */}
      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" disabled className="opacity-70">
                <Lock className="h-3 w-3 mr-1" /> Gerar Relatório
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Disponível no plano premium</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" disabled className="opacity-70">
                <Lock className="h-3 w-3 mr-1" /> <Download className="h-3 w-3 mr-1" /> Exportar CSV
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Disponível no plano premium</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" disabled className="opacity-70">
                <Lock className="h-3 w-3 mr-1" /> <FileText className="h-3 w-3 mr-1" /> Controle de Recibos
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Disponível no plano premium</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Transactions List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expense">Despesas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {renderTransactions(records, loading, navigate)}
        </TabsContent>
        
        <TabsContent value="income" className="space-y-4">
          {renderTransactions(
            records.filter(record => record.type === 'income'),
            loading,
            navigate
          )}
        </TabsContent>
        
        <TabsContent value="expense" className="space-y-4">
          {renderTransactions(
            records.filter(record => record.type === 'expense'),
            loading,
            navigate
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to render transactions
function renderTransactions(
  records: FinancialRecord[],
  loading: boolean, 
  navigate: (path: string) => void
) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-3">
          Nenhum registro encontrado.
        </p>
        <Button onClick={() => navigate('/financeiro/novo')}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Registro
        </Button>
      </div>
    );
  }
  
  return records.map(record => (
    <Card
      key={record.id}
      className={`hover:shadow-md transition-shadow border-l-4 ${
        record.type === 'income' ? 'border-l-green-500' : 'border-l-red-500'
      } cursor-pointer`}
      onClick={() => navigate(`/financeiro/${record.id}`)}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center">
            {record.type === 'income' ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className="font-medium">{record.description}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {format(parseISO(record.date), "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
        </div>
        <span
          className={`font-semibold ${
            record.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(Math.abs(record.amount))}
        </span>
      </CardContent>
    </Card>
  ));
}

export default Financeiro;
