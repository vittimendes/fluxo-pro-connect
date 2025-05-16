
import { Button } from '@/components/ui/button';
import { DollarSign, MessageSquare } from 'lucide-react';
import { Appointment } from '@/services/mockData';

interface AppointmentActionsProps {
  appointment: Appointment;
  sendWhatsAppReminder: (appointment: Appointment) => void;
  navigateToFinancialRecord: (appointment: Appointment) => void;
  renderStatusButton: (appointment: Appointment) => JSX.Element | null;
  onEditClick: (e: React.MouseEvent, id: string) => void;
}

export const AppointmentActions = ({
  appointment,
  sendWhatsAppReminder,
  navigateToFinancialRecord,
  renderStatusButton,
  onEditClick
}: AppointmentActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="text-xs h-8 whitespace-nowrap"
        onClick={(e) => onEditClick(e, appointment.id)}
      >
        Editar
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="text-xs h-8"
        onClick={(e) => {
          e.stopPropagation();
          sendWhatsAppReminder(appointment);
        }}
      >
        <MessageSquare className="h-3 w-3 mr-1" />
        Lembrete
      </Button>
      
      {/* Status Dropdown */}
      <span onClick={(e) => e.stopPropagation()}>
        {renderStatusButton(appointment)}
      </span>
      
      {/* Financial record button */}
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8"
        onClick={(e) => {
          e.stopPropagation();
          navigateToFinancialRecord(appointment);
        }}
      >
        <DollarSign className="h-3 w-3 mr-1" />
        Registro Financeiro
      </Button>
    </div>
  );
};
