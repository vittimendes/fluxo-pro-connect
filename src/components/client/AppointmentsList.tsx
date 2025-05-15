
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/types';
import { Calendar, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePremium } from '@/hooks/use-premium';
import { PremiumFeature } from '@/components/PremiumFeature';

interface AppointmentsListProps {
  appointments: Appointment[];
  clientId: string;
}

export default function AppointmentsList({ appointments, clientId }: AppointmentsListProps) {
  const navigate = useNavigate();
  const { isPremium } = usePremium();

  if (appointments.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Nenhum atendimento registrado.</p>
        <Button 
          variant="link" 
          onClick={() => navigate(`/agenda/novo?clientId=${clientId}`)}
        >
          Agendar atendimento
        </Button>
      </div>
    );
  }

  return (
    <PremiumFeature>
      <div className="space-y-3">
        {appointments.map(appointment => (
          <Card 
            key={appointment.id} 
            className="hover:shadow-sm cursor-pointer transition-shadow"
            onClick={() => navigate(`/agenda/${appointment.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium mb-1">{appointment.type}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {format(parseISO(appointment.date), "dd 'de' MMMM", { locale: ptBR })} • {appointment.time}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'canceled' ? 'bg-red-100 text-red-800' :
                    appointment.status === 'no_show' ? 'bg-amber-100 text-amber-800' :
                    appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status === 'completed' ? 'Realizado' :
                    appointment.status === 'canceled' ? 'Cancelado' :
                    appointment.status === 'no_show' ? 'Não compareceu' :
                    appointment.status === 'confirmed' ? 'Confirmado' :
                    'Agendado'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center mt-2 text-sm">
                <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {appointment.location === 'online' ? 'Online' :
                  appointment.location === 'in_person' ? 'Presencial' :
                  appointment.location === 'home_visit' ? 'Domicílio' :
                  appointment.location}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PremiumFeature>
  );
}
