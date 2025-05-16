
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface FinancialSummary {
  income: number;
  expenses: number;
  balance: number;
}

interface FinancialSummaryProps {
  financialSummary: FinancialSummary;
  selectedPeriod: 'current' | 'custom' | 'all';
  selectedMonth: number;
  selectedYear: number;
  setSelectedPeriod: (period: 'current' | 'custom' | 'all') => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
}

export const FinancialSummary = ({ 
  financialSummary
}: FinancialSummaryProps) => {
  
  return (
    <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
        </div>
        <CardDescription>Mês Atual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Receitas</p>
            <p className="text-green-600 font-semibold">
              R$ {financialSummary.income.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Despesas</p>
            <p className="text-red-600 font-semibold">
              R$ {financialSummary.expenses.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Saldo</p>
            <p className={`font-semibold ${financialSummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {financialSummary.balance.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
