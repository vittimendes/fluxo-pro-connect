
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PremiumFeature } from '../PremiumFeature';
import { Calendar, ChevronDown, Wallet } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface FinancialSummaryCardProps {
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export const FinancialSummaryCard = ({ summary }: FinancialSummaryCardProps) => {
  const [showPeriodFilter, setShowPeriodFilter] = useState(false);
  
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
          
          <PremiumFeature>
            <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
              <Calendar className="h-4 w-4" />
              Mês Atual
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PremiumFeature>
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
