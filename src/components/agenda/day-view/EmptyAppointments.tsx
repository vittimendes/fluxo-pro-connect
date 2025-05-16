
import { Button } from '@/components/ui/button';
import { FilterX, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { statusOptions } from '@/components/appointment/AppointmentStatusUtils';

interface EmptyAppointmentsProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const EmptyAppointments = ({ 
  statusFilter, 
  setStatusFilter 
}: EmptyAppointmentsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-3">
        {statusFilter !== "all" 
          ? `Não há agendamentos com status '${statusOptions.find(s => s.value === statusFilter)?.label}' para esta data.` 
          : "Não há agendamentos para esta data."}
      </p>
      <div className="flex justify-center gap-3">
        {statusFilter !== "all" && (
          <Button variant="outline" onClick={() => setStatusFilter("all")}>
            <FilterX className="h-4 w-4 mr-1" /> Limpar Filtro
          </Button>
        )}
        <Button onClick={() => navigate('/agenda/novo')}>
          <Plus className="h-4 w-4 mr-1" /> Novo Agendamento
        </Button>
      </div>
    </div>
  );
};
