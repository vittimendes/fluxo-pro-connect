
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialSummaryCardProps {
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export const FinancialSummaryCard = ({ summary }: FinancialSummaryCardProps) => {
  // Format amount to display as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
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
  );
};
