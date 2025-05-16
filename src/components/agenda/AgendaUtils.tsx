
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/mockData';
import { ReactNode } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock8, 
  AlertCircle 
} from 'lucide-react';

export type StatusConfig = {
  label: string;
  icon: ReactNode;
  color: string;
};

export const statusConfig: Record<string, StatusConfig> = {
  scheduled: {
    label: 'Agendado',
    icon: <Clock8 className="h-3 w-3" />,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  confirmed: {
    label: 'Confirmado',
    icon: <CheckCircle2 className="h-3 w-3" />,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  canceled: {
    label: 'Cancelado',
    icon: <XCircle className="h-3 w-3" />,
    color: 'bg-red-100 text-red-700 border-red-300',
  },
  no_show: {
    label: 'Não Compareceu',
    icon: <AlertCircle className="h-3 w-3" />,
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  completed: {
    label: 'Concluído',
    icon: <CheckCircle2 className="h-3 w-3" />,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
};

// Format appointment time (9:00 -> 09:00)
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

// Helper to get location text
export const getLocationText = (location: string): string => {
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

export const renderStatusBadge = (status: string) => {
  const config = statusConfig[status];
  if (!config) return null;

  return (
    <div className={`flex items-center gap-1 ${config.color} text-xs font-medium py-0.5 px-1.5 rounded-full`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

export const createRenderStatusButton = (updateAppointmentStatus: (appointmentId: string, status: string) => Promise<void>) => 
  (appointment: Appointment) => {
    const config = statusConfig[appointment.status];
    if (!config) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs h-8 flex items-center gap-1 ${config.color} border`}
          >
            {config.icon}
            <span>{config.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(statusConfig).map(([status, config]) => (
            <DropdownMenuItem 
              key={status} 
              className="flex items-center gap-2"
              onClick={() => updateAppointmentStatus(appointment.id, status)}
            >
              <span className={`flex items-center ${config.color.split(' ')[1]}`}>{config.icon}</span>
              {config.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
