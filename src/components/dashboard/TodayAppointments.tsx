
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { Appointment } from '@/services/types';
import { AppointmentCard } from './AppointmentCard';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAppointmentStatusInfo } from '@/components/appointment/AppointmentStatusUtils';

interface TodayAppointmentsProps {
  appointments: Appointment[];
  isLoading: boolean;
  formatTime: (time: string) => string;
}

export const TodayAppointments: React.FC<TodayAppointmentsProps> = ({
  appointments,
  isLoading,
  formatTime
}) => {
  const navigate = useNavigate();

  // Helper functions
  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'online':
        return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'in_person':
        return <MapPin className="h-4 w-4 text-green-500" />;
      case 'home_visit':
        return <MapPin className="h-4 w-4 text-orange-500" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getLocationText = (location: string): string => {
    switch (location) {
      case 'online':
        return 'Online';
      case 'in_person':
        return 'Presencial';
      case 'home_visit':
        return 'Domicílio';
      default:
        return location;
    }
  };

  const formatAppointmentDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.getTime() === today.getTime()) {
        return 'Hoje';
      } else if (date.getTime() === tomorrow.getTime()) {
        return 'Amanhã';
      } else {
        return format(date, "dd/MM/yyyy", { locale: ptBR });
      }
    } catch (error) {
      return dateStr;
    }
  };

  const handleAppointmentClick = (id: string) => {
    navigate(`/agenda/${id}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximos Agendamentos
        </h3>
        <Button
          variant="link"
          onClick={() => navigate('/agenda')}
          className="p-0 h-auto text-primary"
        >
          Ver todos
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
          <p>Carregando agendamentos...</p>
        </div>
      ) : appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id}
              onClick={() => handleAppointmentClick(appointment.id)}
              className="cursor-pointer"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="font-medium">{appointment.clientName}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <span>{formatAppointmentDate(appointment.date)} - {formatTime(appointment.time)}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {getLocationIcon(appointment.location)}
                        <span className="ml-1">{getLocationText(appointment.location)}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="bg-primary-muted text-primary text-xs px-2 py-1 rounded-full">
                        {appointment.type}
                      </span>
                      {(() => {
                        const statusInfo = getAppointmentStatusInfo(appointment.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusInfo.styles}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{statusInfo.label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Não há agendamentos pendentes.</p>
            <Button 
              variant="link" 
              onClick={() => navigate('/agenda/novo')}
              className="text-primary mt-2"
            >
              Criar novo agendamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
