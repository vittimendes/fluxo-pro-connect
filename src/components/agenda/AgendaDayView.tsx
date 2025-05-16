
import { Appointment } from '@/services/mockData';
import { StatusConfig } from './AgendaUtils';
import { LoadingSpinner } from './day-view/LoadingSpinner';
import { EmptyAppointments } from './day-view/EmptyAppointments';
import { AppointmentCard } from './day-view/AppointmentCard';

interface AgendaDayViewProps {
  loading: boolean;
  filteredAppointments: Appointment[];
  statusFilter: string;
  statusConfig: Record<string, StatusConfig>;
  formatTime: (time: string) => string;
  getLocationText: (location: string) => string;
  renderStatusButton: (appointment: Appointment) => JSX.Element | null;
  sendWhatsAppReminder: (appointment: Appointment) => void;
  navigateToFinancialRecord: (appointment: Appointment) => void;
  setStatusFilter: (status: string) => void;
}

export const AgendaDayView = ({
  loading,
  filteredAppointments,
  statusFilter,
  formatTime,
  getLocationText,
  renderStatusButton,
  sendWhatsAppReminder,
  navigateToFinancialRecord,
  setStatusFilter,
}: AgendaDayViewProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (filteredAppointments.length === 0) {
    return (
      <EmptyAppointments 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
    );
  }
  
  return (
    <div className="space-y-3">
      {filteredAppointments.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          formatTime={formatTime}
          getLocationText={getLocationText}
          renderStatusButton={renderStatusButton}
          sendWhatsAppReminder={sendWhatsAppReminder}
          navigateToFinancialRecord={navigateToFinancialRecord}
        />
      ))}
    </div>
  );
};
