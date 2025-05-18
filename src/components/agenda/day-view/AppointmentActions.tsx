
// @file AppointmentActions.tsx
// Renders the action buttons for each appointment in the day view,
// including edit, WhatsApp message, status, and financial record buttons.

import { Button } from '@/components/ui/button';
import { DollarSign, MessageSquare, Eye } from 'lucide-react';
import { Appointment } from '@/services/mockData';

// @section Props interface
interface AppointmentActionsProps {
  appointment: Appointment;
  sendWhatsAppReminder: (appointment: Appointment) => void;
  navigateToFinancialRecord: (appointment: Appointment) => void;
  renderStatusButton: (appointment: Appointment) => JSX.Element | null;
  onEditClick: (e: React.MouseEvent, id: string) => void;
}

// @component Renders a column of action buttons for each appointment
export const AppointmentActions = ({
  appointment,
  sendWhatsAppReminder,
  navigateToFinancialRecord,
  renderStatusButton,
  onEditClick
}: AppointmentActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* @event Edit appointment button */}
      <Button 
        variant="outline" 
        size="sm"
        className="text-xs h-8 whitespace-nowrap min-w-[120px]"
        onClick={(e) => onEditClick(e, appointment.id)}
      >
        <Eye className="h-3 w-3 mr-1" />
        Detalhes
      </Button>
      
      {/* @event WhatsApp reminder button */}
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8 min-w-[120px] justify-start"
        onClick={(e) => {
          e.stopPropagation();
          sendWhatsAppReminder(appointment);
        }}
      >
        <MessageSquare className="h-3 w-3 mr-1" />
        Lembrete
      </Button>
      
      {/* @component Status change dropdown */}
      <span onClick={(e) => e.stopPropagation()} className="min-w-[120px]">
        {renderStatusButton(appointment)}
      </span>
      
      {/* @event Financial record creation button */}
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8 min-w-[120px] justify-start"
        onClick={(e) => {
          e.stopPropagation();
          navigateToFinancialRecord(appointment);
        }}
      >
        <DollarSign className="h-3 w-3 mr-1" />
        Registrar
      </Button>
    </div>
  );
};
