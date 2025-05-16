
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { Appointment } from '@/services/types';
import { AppointmentCard } from './AppointmentCard';

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

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agendamentos de Hoje
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
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              formatTime={formatTime}
              getLocationIcon={getLocationIcon}
              getLocationText={getLocationText}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Não há agendamentos para hoje.</p>
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
