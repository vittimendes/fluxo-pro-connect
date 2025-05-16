
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PremiumFeature } from '../PremiumFeature';
import { Calendar, ChevronDown, Wallet, Lock, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { usePremium } from '@/hooks/use-premium';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialSummaryCardProps {
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
  onPeriodChange?: (period: 'current' | 'custom' | 'all') => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export const FinancialSummaryCard = ({ 
  summary,
  onPeriodChange,
  onDateRangeChange
}: FinancialSummaryCardProps) => {
  const { isPremium } = usePremium();
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'custom' | 'all'>('current');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(); 
  
  const handlePeriodChange = (value: string) => {
    const period = value as 'current' | 'custom' | 'all';
    setSelectedPeriod(period);
    
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };
  
  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };
  
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
          
          {isPremium ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-4 w-4" />
                  {selectedPeriod === 'current' && "Mês Atual"}
                  {selectedPeriod === 'custom' && "Período"}
                  {selectedPeriod === 'all' && "Total Geral"}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-2">
                  <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="w-[180px] mb-2">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Mês Atual</SelectItem>
                      <SelectItem value="custom">Período</SelectItem>
                      <SelectItem value="all">Total Geral</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedPeriod === 'custom' && (
                    <div className="mt-2">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleRangeSelect}
                        numberOfMonths={2}
                        locale={ptBR}
                        className="pointer-events-auto"
                      />
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        {dateRange?.from && dateRange?.to ? (
                          <p>
                            {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </p>
                        ) : (
                          <p>Selecione um período</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button variant="outline" size="sm" className="h-8 gap-1 cursor-not-allowed opacity-80">
                      <Lock className="h-3 w-3 mr-1" />
                      <Calendar className="h-4 w-4 mr-1" />
                      Mês Atual
                      <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Filtro por período disponível no plano PRO</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
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
