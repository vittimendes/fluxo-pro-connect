
import { useNavigate } from 'react-router-dom';
import { Clock, User, MapPin, MessageSquare, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Appointment, Client } from '@/services/mockData';
import { FilterX, Plus } from 'lucide-react';
import { StatusConfig } from './AgendaUtils';

interface AgendaDayViewProps {
  loading: boolean;
  filteredAppointments: Appointment[];
  statusFilter: string;
  statusConfig: Record<string, StatusConfig>;
  formatTime: (time: string) => string;
  getLocationText: (location: string) => string;
  renderStatusButton: (appointment: Appointment) => JSX.Element | null;
  sendWhatsAppReminder: (appointment: Appointment) => void;
  navigateToFinancialRecord: (appointment: Appointment) => void;
  setStatusFilter: (status: string) => void;
}

export const AgendaDayView = ({
  loading,
  filteredAppointments,
  statusFilter,
  statusConfig,
  formatTime,
  getLocationText,
  renderStatusButton,
  sendWhatsAppReminder,
  navigateToFinancialRecord,
  setStatusFilter,
}: AgendaDayViewProps) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (filteredAppointments.length === 0) {
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
  }
  
  return (
    <div className="space-y-3">
      {filteredAppointments.map(appointment => (
        <Card key={appointment.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/agenda/${appointment.id}`)}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">
                    {formatTime(appointment.time)} - {appointment.duration} min
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{appointment.clientName}</span>
                </div>
                <div className="flex">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{getLocationText(appointment.location)}</span>
                </div>
                <div className="inline-block bg-primary-muted text-primary text-xs px-2 py-0.5 rounded-full">
                  {appointment.type}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-8 whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/agenda/${appointment.id}`);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    sendWhatsAppReminder(appointment);
                  }}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Lembrete
                </Button>
                
                {/* Status Dropdown */}
                <span onClick={(e) => e.stopPropagation()}>
                  {renderStatusButton(appointment)}
                </span>
                
                {/* Financial record button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToFinancialRecord(appointment);
                  }}
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Registro Financeiro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Import at the top was missing, adding it here for the statusOptions
import { statusOptions } from '@/components/appointment/AppointmentStatusUtils';
