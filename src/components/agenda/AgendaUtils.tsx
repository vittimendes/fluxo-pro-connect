
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
import { format, addDays, parseISO, startOfWeek, startOfMonth, endOfMonth, getDaysInMonth, getDay } from 'date-fns';
import { Client } from '@/services/mockData';
import { toast } from "@/hooks/use-toast";

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

// Generate week day headers
export const generateWeekDays = (weekStartDate: Date) => {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
};

// Generate month days grid
export const generateMonthDays = (monthStartDate: Date) => {
  const daysInMonth = getDaysInMonth(monthStartDate);
  const monthStart = startOfMonth(monthStartDate);
  const firstDayOfWeek = getDay(monthStart);
  
  // Generate array for the days grid (previous month, current month, next month)
  const days = [];
  
  // Add days from previous month
  const prevMonthDays = firstDayOfWeek;
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    days.push({
      date: addDays(monthStart, -i - 1),
      isCurrentMonth: false
    });
  }
  
  // Add days from current month
  for (let i = 0; i < daysInMonth; i++) {
    days.push({
      date: addDays(monthStart, i),
      isCurrentMonth: true
    });
  }
  
  // Add days from next month (to complete grid)
  const totalDays = 42; // 6 weeks grid
  const nextMonthDays = totalDays - days.length;
  for (let i = 0; i < nextMonthDays; i++) {
    days.push({
      date: addDays(addDays(monthStart, daysInMonth), i),
      isCurrentMonth: false
    });
  }
  
  return days;
};

// Filter appointments for a specific day
export const getAppointmentsForDay = (date: Date, filteredAppointments: Appointment[]) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return filteredAppointments.filter(app => app.date === dateStr);
};

// Get client phone number from the client list
export const getClientPhone = (clientId: string, clients: Client[]): string => {
  const client = clients.find(c => c.id === clientId);
  return client?.phone || "5511999999999"; // Default fallback if not found
};

// Send WhatsApp reminder
export const sendWhatsAppReminder = (appointment: Appointment, clients: Client[]) => {
  const phone = getClientPhone(appointment.clientId, clients);
  const formattedDate = format(parseISO(appointment.date), 'dd/MM/yyyy');
  
  const message = encodeURIComponent(
    `Olá ${appointment.clientName}! Este é um lembrete para seu agendamento de ${appointment.type} em ${formattedDate} às ${formatTime(appointment.time)}.`
  );
  
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  
  toast({
    title: "Lembrete enviado",
    description: "Link do WhatsApp foi aberto com a mensagem personalizada.",
  });
};
