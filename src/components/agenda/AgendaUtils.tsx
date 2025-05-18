
// @file AgendaUtils.tsx
// Provides utility functions and components for the agenda views,
// including status rendering, formatting, and appointment management.

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/mockData';
import { ReactNode, useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock8, 
  AlertCircle 
} from 'lucide-react';
import { format, addDays, parseISO, startOfWeek, startOfMonth, endOfMonth, getDaysInMonth, getDay } from 'date-fns';
import { Client } from '@/services/mockData';
import { toast } from "@/hooks/use-toast";

// @section Type definitions and configuration
export type StatusConfig = {
  label: string;
  icon: ReactNode;
  color: string;
};

// @section Visual configurations for appointment statuses
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

// @utility Format appointment time (9:00 -> 09:00)
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

// @utility Get human-readable location text from location code
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

// @component Renders a status badge with appropriate colors and icon
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

// @component Factory function that creates a status button component with state management
export const createRenderStatusButton = (updateAppointmentStatus: (appointmentId: string, status: string) => Promise<void>) => {
  // @function Returns a component with internal state for status management
  return (appointment: Appointment) => {
    // @section Component state
    const [currentStatus, setCurrentStatus] = useState<'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show'>(appointment.status);
    const [isLoading, setIsLoading] = useState(false);
    
    // Get the configuration for the current status
    const config = statusConfig[currentStatus];
    if (!config) return null;

    // @event Handler for status change selections
    const handleStatusChange = async (status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show') => {
      if (status === currentStatus) return;
      
      // Update local state immediately for responsive UI
      setIsLoading(true);
      setCurrentStatus(status);
      
      // @api Update appointment status
      try {
        await updateAppointmentStatus(appointment.id, status);
        
        // Show success toast
        toast({
          title: "Status atualizado",
          description: `Status alterado para ${statusConfig[status].label}`,
        });
      } catch (error) {
        // Revert to previous status if there was an error
        setCurrentStatus(appointment.status);
        toast({
          title: "Erro ao atualizar status",
          description: "Não foi possível atualizar o status do agendamento.",
          variant: "destructive"
        });
        console.error('Error updating appointment status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const [open, setOpen] = useState(false);
    
    // @component Status change dropdown
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs h-8 min-w-[120px] flex items-center gap-1 justify-between truncate ${config.color} border`}
            disabled={isLoading}
          >
            {config.icon}
            <span className="truncate">{config.label}</span>
            {isLoading && <span className="animate-spin">⟳</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border shadow-md">
          {Object.entries(statusConfig).map(([status, statusInfo]) => (
            <DropdownMenuItem 
              key={status} 
              className={`flex items-center gap-2 ${currentStatus === status ? 'bg-accent' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Use the correct type assertion for the status
                handleStatusChange(status as 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show');
                setOpen(false); // Fecha o dropdown
              }}
            >
              <span className={`flex items-center ${statusInfo.color.split(' ')[1]}`}>{statusInfo.icon}</span>
              {statusInfo.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
};

// @section Date utilities for agenda views

// @utility Generate week day headers
export const generateWeekDays = (weekStartDate: Date) => {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
};

// @utility Generate month days grid for calendar view
export const generateMonthDays = (monthStartDate: Date) => {
  const daysInMonth = getDaysInMonth(monthStartDate);
  const monthStart = startOfMonth(monthStartDate);
  const firstDayOfWeek = getDay(monthStart);
  
  // Generate array for the days grid (previous month, current month, next month)
  const days = [];
  
  // @section Add days from previous month
  const prevMonthDays = firstDayOfWeek;
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    days.push({
      date: addDays(monthStart, -i - 1),
      isCurrentMonth: false
    });
  }
  
  // @section Add days from current month
  for (let i = 0; i < daysInMonth; i++) {
    days.push({
      date: addDays(monthStart, i),
      isCurrentMonth: true
    });
  }
  
  // @section Add days from next month (to complete grid)
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

// @utility Filter appointments for a specific day
export const getAppointmentsForDay = (date: Date, filteredAppointments: Appointment[]) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return filteredAppointments.filter(app => app.date === dateStr);
};

// @utility Get client phone number from the client list
export const getClientPhone = (clientId: string, clients: Client[]): string => {
  const client = clients.find(c => c.id === clientId);
  return client?.phone || "5511999999999"; // Default fallback if not found
};

// @function Send WhatsApp reminder to client
export const sendWhatsAppReminder = (appointment: Appointment, clients: Client[]) => {
  const phone = getClientPhone(appointment.clientId, clients);
  const formattedDate = format(parseISO(appointment.date), 'dd/MM/yyyy');
  
  // @section Construct and encode message
  const message = encodeURIComponent(
    `Olá ${appointment.clientName}! Este é um lembrete para seu agendamento de ${appointment.type} em ${formattedDate} às ${formatTime(appointment.time)}.`
  );
  
  // @event Open WhatsApp with pre-filled message
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  
  // @event Show confirmation toast
  toast({
    title: "Lembrete enviado",
    description: "Link do WhatsApp foi aberto com a mensagem personalizada.",
  });
};
