
import { Appointment } from '@/services/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  User, 
  CalendarClock, 
  Clock, 
  FileText, 
  MapPin 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getAppointmentStatusInfo } from './AppointmentStatusUtils';

interface AppointmentDetailsProps {
  appointment: Appointment;
  onExecuteClick: () => void;
}

export default function AppointmentDetails({ 
  appointment, 
  onExecuteClick 
}: AppointmentDetailsProps) {
  const navigate = useNavigate();
  const { label, icon: StatusIcon, badgeVariant } = getAppointmentStatusInfo(appointment.status);
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Atendimento</CardTitle>
            <CardDescription>Detalhes do agendamento</CardDescription>
          </div>
          <Badge 
            variant={badgeVariant as any}
            className="flex items-center space-x-1 px-2 py-1"
          >
            <StatusIcon className="h-4 w-4" />
            <span>{label}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">{appointment.clientName}</span>
            </div>
            
            <div className="flex items-center">
              <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {format(parseISO(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                {' às '}
                {appointment.time}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{appointment.duration} minutos</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{appointment.type}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {appointment.location === 'online' && 'Online'}
                {appointment.location === 'in_person' && 'Presencial'}
                {appointment.location === 'home_visit' && 'Domicílio'}
              </span>
            </div>
          </div>
        </div>
        
        {appointment.notes && (
          <div className="mt-4">
            <p className="text-sm font-medium">Observações:</p>
            <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/agenda`)}
        >
          Editar
        </Button>
        
        <Button 
          disabled={appointment.status === 'completed' || appointment.status === 'canceled'}
          onClick={onExecuteClick}
        >
          <StatusIcon className="h-4 w-4 mr-2" />
          {appointment.status === 'completed' ? 'Atendimento Concluído' : 'Executar Atendimento'}
        </Button>
      </CardFooter>
    </Card>
  );
}
