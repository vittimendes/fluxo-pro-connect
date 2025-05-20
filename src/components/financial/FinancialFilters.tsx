
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, User, Lock, Filter } from 'lucide-react';
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
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FinancialFiltersProps {
  selectedClientId: string | null;
  selectedPeriod: 'current' | 'custom' | 'all';
  dateRange: DateRange | undefined;
  onClientChange: (clientId: string | null) => void;
  onPeriodChange: (period: 'current' | 'custom' | 'all') => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  availableCategories: string[];
}

export const FinancialFilters = ({
  selectedClientId,
  selectedPeriod,
  dateRange,
  onClientChange,
  onPeriodChange,
  onDateRangeChange,
  selectedCategory,
  onCategoryChange,
  availableCategories
}: FinancialFiltersProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPremium } = usePremium();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(dateRange?.from);
  const [endDate, setEndDate] = useState<Date | undefined>(dateRange?.to);

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

  useEffect(() => {
    // Update local state when dateRange prop changes
    setStartDate(dateRange?.from);
    setEndDate(dateRange?.to);
  }, [dateRange]);

  const handleClientChange = (value: string) => {
    if (value === 'all') {
      onClientChange(null);
    } else if (value === 'no-client') {
      onClientChange('no-client');
    } else {
      onClientChange(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === 'all' ? null : value);
  };

  const handlePeriodSelection = (period: 'current' | 'custom' | 'all') => {
    if (period === 'custom' && isPremium) {
      setDialogOpen(true);
      onPeriodChange(period);
    } else {
      onPeriodChange(period);
    }
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate) {
      onDateRangeChange({ from: startDate, to: endDate });
    }
    setDialogOpen(false);
  };

  const getPeriodDisplayText = () => {
    switch (selectedPeriod) {
      case 'current':
        return "Mês Atual";
      case 'custom':
        if (dateRange?.from && dateRange?.to) {
          return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
        }
        return "Período";
      case 'all':
        return "Total Geral";
      default:
        return "Selecione o período";
    }
  };

  const isApplyButtonDisabled = !startDate || !endDate;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-1/2">
          <Select 
            value={selectedClientId === 'no-client' ? 'no-client' : selectedClientId || 'all'} 
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
              <SelectItem value="all">Todos os registros</SelectItem>
              <SelectItem value="no-client">Sem cliente associado</SelectItem>
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
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-10 justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {getPeriodDisplayText()}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handlePeriodSelection('current')}>
                    Mês Atual
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePeriodSelection('custom')}>
                    Período
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePeriodSelection('all')}>
                    Total Geral
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Selecione o período</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Data Inicial</h4>
                        <div className="border rounded-md p-1">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            locale={ptBR}
                            className="pointer-events-auto"
                          />
                        </div>
                        {startDate && (
                          <p className="text-sm text-muted-foreground text-center">
                            {isValid(startDate) ? format(startDate, "dd/MM/yyyy") : "Data inválida"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Data Final</h4>
                        <div className="border rounded-md p-1">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            locale={ptBR}
                            className="pointer-events-auto"
                          />
                        </div>
                        {endDate && (
                          <p className="text-sm text-muted-foreground text-center">
                            {isValid(endDate) ? format(endDate, "dd/MM/yyyy") : "Data inválida"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleApplyDateRange} 
                      disabled={isApplyButtonDisabled}
                    >
                      Aplicar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Button variant="outline" className="w-full h-10 justify-between cursor-not-allowed opacity-80">
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        <CalendarIcon className="h-4 w-4" />
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

      {/* Category filter */}
      <div className="w-full">
        <Select 
          value={selectedCategory || 'all'} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Categoria" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {availableCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear filters button - shown when any filter is active */}
      {(selectedClientId || selectedCategory || selectedPeriod !== 'current') && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              onClientChange(null);
              onCategoryChange(null);
              onPeriodChange('current');
              onDateRangeChange(undefined);
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};
