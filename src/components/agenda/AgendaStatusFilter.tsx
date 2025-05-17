
import { FilterX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusOptions } from '@/components/appointment/AppointmentStatusUtils';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface AgendaStatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const AgendaStatusFilter = ({ statusFilter, setStatusFilter }: AgendaStatusFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between w-full">
      {/* Filter section - full width on mobile */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-sm font-medium">Filtrar por:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por status">
              {statusFilter === "all" ? (
                <div className="flex items-center gap-2">
                  <FilterX className="h-4 w-4" />
                  <span>Todos</span>
                </div>
              ) : (
                (() => {
                  const option = statusOptions.find(s => s.value === statusFilter) || statusOptions[0];
                  const StatusIcon = option.icon;
                  return (
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  );
                })()
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <FilterX className="h-4 w-4" />
                <span>Todos</span>
              </div>
            </SelectItem>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Premium Features Section - flex-wrap and full width on mobile
      <div className="flex flex-wrap justify-start sm:justify-end items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" disabled className="opacity-70">
                <Lock className="h-3 w-3 mr-1" /> Exportar Agenda
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
                <Lock className="h-3 w-3 mr-1" /> Lembretes em Massa
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Disponível no plano premium</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      */}
    </div>
  );
};
