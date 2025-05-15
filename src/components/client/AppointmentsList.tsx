
import { Appointment } from '@/services/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarClock, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AppointmentsListProps {
  appointments: Appointment[];
  clientId: string;
}

const AppointmentsList = ({ appointments, clientId }: AppointmentsListProps) => {
  const navigate = useNavigate();
  
  // Format appointment time for display
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };
  
  // Get location text
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
  
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Este cliente não possui atendimentos registrados.</p>
          <Button 
            variant="link" 
            onClick={() => navigate('/agenda/novo', { state: { clientId } })}
            className="text-primary mt-2"
          >
            Criar novo agendamento
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <Card 
          key={appointment.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/agenda/${appointment.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <span className="font-medium">{appointment.type}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <CalendarClock className="h-3 w-3 mr-1" />
                  <span>
                    {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })} - {formatTime(appointment.time)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{appointment.duration} min</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{getLocationText(appointment.location)}</span>
                </div>
              </div>
              <div className="text-right">
                <span 
                  className={`text-xs px-2 py-1 rounded-full font-medium
                    ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                    ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                    ${appointment.status === 'canceled' ? 'bg-red-100 text-red-800' : ''}
                    ${appointment.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
                  `}
                >
                  {appointment.status === 'scheduled' && 'Agendado'}
                  {appointment.status === 'confirmed' && 'Confirmado'}
                  {appointment.status === 'canceled' && 'Cancelado'}
                  {appointment.status === 'completed' && 'Concluído'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentsList;
