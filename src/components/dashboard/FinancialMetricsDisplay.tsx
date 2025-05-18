
import { CardContent } from '@/components/ui/card';

interface FinancialMetricsDisplayProps {
  income: number;
  expenses: number;
  balance: number;
}

export const FinancialMetricsDisplay = ({ 
  income, 
  expenses, 
  balance 
}: FinancialMetricsDisplayProps) => {
  return (
    <CardContent>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Receitas</p>
          <p className="text-green-600 font-semibold">
            R$ {income.toFixed(2)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Despesas</p>
          <p className="text-red-600 font-semibold">
            R$ {expenses.toFixed(2)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Saldo</p>
          <p className={`font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>
    </CardContent>
  );
};
