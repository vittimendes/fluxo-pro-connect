
import { 
  CalendarCheck,
  CalendarX,
  CheckCircle,
  Clock,
  UserX
} from 'lucide-react';

export const statusOptions = [
  { value: 'scheduled', label: 'Agendado', icon: Clock },
  { value: 'confirmed', label: 'Confirmado', icon: CalendarCheck },
  { value: 'canceled', label: 'Cancelado', icon: CalendarX },
  { value: 'no_show', label: 'Não Compareceu', icon: UserX },
  { value: 'completed', label: 'Concluído', icon: CheckCircle },
];

export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    case 'canceled':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'no_show':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'completed':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'outline';
    case 'confirmed':
      return 'secondary';
    case 'canceled':
      return 'destructive';
    case 'no_show':
      return 'default'; // dark
    case 'completed':
      return 'success'; // custom success variant
    default:
      return 'outline';
  }
};

export const getAppointmentStatusInfo = (status: string) => {
  const option = statusOptions.find(opt => opt.value === status) || statusOptions[0];
  return {
    ...option,
    badgeVariant: getStatusBadgeVariant(status),
    styles: getStatusStyles(status)
  };
};
