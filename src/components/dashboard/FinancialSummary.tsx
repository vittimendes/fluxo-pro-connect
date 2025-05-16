
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, Lock } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePremium } from '@/hooks/use-premium';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  financialSummary,
  selectedPeriod,
  selectedMonth,
  selectedYear,
  setSelectedPeriod,
  setSelectedMonth,
  setSelectedYear
}: FinancialSummaryProps) => {
  const { isPremium } = usePremium();
  const currentDate = new Date();
  
  const handlePreviousMonth = () => {
    if (!isPremium) return;
    const prevDate = subMonths(new Date(selectedYear, selectedMonth), 1);
    setSelectedMonth(prevDate.getMonth());
    setSelectedYear(prevDate.getFullYear());
  };
  
  const handleNextMonth = () => {
    if (!isPremium) return;
    const nextDate = addMonths(new Date(selectedYear, selectedMonth), 1);
    setSelectedMonth(nextDate.getMonth());
    setSelectedYear(nextDate.getFullYear());
  };
  
  const getPeriodLabel = () => {
    if (selectedPeriod === 'current') {
      return 'Mês Atual';
    } else if (selectedPeriod === 'custom') {
      return format(new Date(selectedYear, selectedMonth), 'MMMM yyyy', { locale: ptBR });
    } else {
      return 'Total Geral';
    }
  };

  return (
    <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
                {getPeriodLabel()}
                {!isPremium && <Lock className="h-3 w-3 ml-1 text-muted-foreground" />}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Selecionar período</h4>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={selectedPeriod === 'current' ? 'default' : 'outline'} 
                    size="sm"
                    className="justify-start"
                    onClick={() => setSelectedPeriod('current')}
                  >
                    Mês Atual
                  </Button>
                  
                  <div className="flex flex-col gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button 
                              variant={selectedPeriod === 'custom' ? 'default' : 'outline'} 
                              size="sm"
                              className="justify-start w-full"
                              onClick={() => isPremium && setSelectedPeriod('custom')}
                              disabled={!isPremium}
                            >
                              {!isPremium && <Lock className="h-3 w-3 mr-1" />}
                              Mês Específico
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!isPremium && (
                          <TooltipContent>
                            <p>Disponível no Plano Pro. Saiba mais nas configurações.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    
                    {selectedPeriod === 'custom' && isPremium && (
                      <div className="flex items-center gap-1 p-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7"
                          onClick={handlePreviousMonth}
                        >
                          <ChevronDown className="h-4 w-4 rotate-90" />
                        </Button>
                        <span className="flex-1 text-center text-sm">
                          {format(new Date(selectedYear, selectedMonth), 'MMMM yyyy', { locale: ptBR })}
                        </span>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7"
                          onClick={handleNextMonth}
                        >
                          <ChevronDown className="h-4 w-4 -rotate-90" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button 
                            variant={selectedPeriod === 'all' ? 'default' : 'outline'} 
                            size="sm"
                            className="justify-start w-full"
                            onClick={() => isPremium && setSelectedPeriod('all')}
                            disabled={!isPremium}
                          >
                            {!isPremium && <Lock className="h-3 w-3 mr-1" />}
                            Total Geral
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {!isPremium && (
                        <TooltipContent>
                          <p>Disponível no Plano Pro. Saiba mais nas configurações.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription>{getPeriodLabel()}</CardDescription>
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
