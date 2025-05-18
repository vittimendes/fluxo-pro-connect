
// @file AgendaDayView.tsx
// Renders the day view of the agenda, displaying a list of appointments
// for the selected day with all their details and actions.

import { Appointment } from '@/services/mockData';
import { StatusConfig } from './AgendaUtils';
import { LoadingSpinner } from './day-view/LoadingSpinner';
import { EmptyAppointments } from './day-view/EmptyAppointments';
import { AppointmentCard } from './day-view/AppointmentCard';

// @section Props interface
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

// @component Renders the day view of the agenda
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
  // @section Conditional rendering based on state
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
  
  // @component List of appointment cards
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
