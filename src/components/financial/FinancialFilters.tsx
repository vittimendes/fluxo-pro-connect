
import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, User, CalendarIcon } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Client } from '@/services/types';
import { clientService } from '@/services/clientService';
import { usePremium } from '@/hooks/use-premium';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarComponent } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Lock } from 'lucide-react';

interface FinancialFiltersProps {
  selectedClientId: string | null;
  selectedPeriod: 'current' | 'custom' | 'all';
  dateRange: DateRange | undefined;
  onClientChange: (clientId: string | null) => void;
  onPeriodChange: (period: 'current' | 'custom' | 'all') => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const FinancialFilters = ({
  selectedClientId,
  selectedPeriod,
  dateRange,
  onClientChange,
  onPeriodChange,
  onDateRangeChange
}: FinancialFiltersProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPremium } = usePremium();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await clientService.getClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientChange = (value: string) => {
    onClientChange(value === 'all' ? null : value);
  };

  const handlePeriodChange = (value: string) => {
    const period = value as 'current' | 'custom' | 'all';
    onPeriodChange(period);
  };
  
  const handleRangeSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="w-full sm:w-1/2">
        <Select 
          value={selectedClientId || 'all'} 
          onValueChange={handleClientChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <SelectValue placeholder="Selecione um cliente" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-1/2">
        {isPremium ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-10 justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {selectedPeriod === 'current' && "Mês Atual"}
                  {selectedPeriod === 'custom' && "Período"}
                  {selectedPeriod === 'all' && "Total Geral"}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
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
                <div className="w-full">
                  <Button variant="outline" className="w-full h-10 justify-between cursor-not-allowed opacity-80">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      <Calendar className="h-4 w-4" />
                      Mês Atual
                    </div>
                    <ChevronDown className="h-3 w-3 opacity-50" />
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
    </div>
  );
};
