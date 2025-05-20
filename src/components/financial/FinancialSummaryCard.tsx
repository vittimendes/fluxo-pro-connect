
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface FinancialSummaryCardProps {
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export const FinancialSummaryCard = ({ summary }: FinancialSummaryCardProps) => {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Receitas</p>
            <p className="text-green-600 font-medium">
              R$ {summary.income.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Despesas</p>
            <p className="text-red-600 font-medium">
              R$ {summary.expenses.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Saldo</p>
            <p className={`font-medium ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {summary.balance.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
