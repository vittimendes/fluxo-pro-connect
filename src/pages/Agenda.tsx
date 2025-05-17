
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { mockDataService, Client, Appointment } from '@/services/mockData';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAgenda } from '@/hooks/use-agenda';
import { useAppointmentStatus } from '@/hooks/use-appointment-status';

// Import shared utils and components
import { AgendaHeader } from '@/components/agenda/AgendaHeader';
import { AgendaStatusFilter } from '@/components/agenda/AgendaStatusFilter';
import { AgendaDayView } from '@/components/agenda/AgendaDayView';
import { AgendaWeekView } from '@/components/agenda/AgendaWeekView';
import { AgendaMonthView } from '@/components/agenda/AgendaMonthView';
import { 
  statusConfig,
  formatTime,
  getLocationText,
  renderStatusBadge,
  sendWhatsAppReminder,
  getAppointmentsForDay,
  generateWeekDays,
  generateMonthDays
} from '@/components/agenda/AgendaUtils';
import { createRenderStatusButton } from '@/components/agenda/AgendaUtils';

const Agenda = () => {
  const isMobile = useIsMobile();
  const initialViewSet = useRef(false);
  const [clients, setClients] = useState<Client[]>([]);
  
  const {
    currentDate,
    setCurrentDate,
    currentView,
    weekStartDate,
    monthStartDate,
    loading,
    filteredAppointments,
    setFilteredAppointments,
    statusFilter,
    setStatusFilter,
    handlePrevious,
    handleNext,
    setView,
    navigateToFinancialRecord
  } = useAgenda();
  
  // Use the appointments status hook to manage appointment status updates
  const { updateAppointmentStatus } = useAppointmentStatus(
    filteredAppointments,
    setFilteredAppointments
  );

  // Set default view to 'day' on mobile devices, but only once when the component mounts
  useEffect(() => {
    if (isMobile && !initialViewSet.current) {
      setView('day');
      initialViewSet.current = true;
    }
  }, [isMobile, setView]);

  useEffect(() => {
    // Fetch clients for phone numbers
    const fetchClients = async () => {
      try {
        const clientsData = await mockDataService.getClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    
    fetchClients();
  }, []);

  // Send WhatsApp reminder with client data
  const handleSendWhatsAppReminder = (appointment: Appointment) => {
    sendWhatsAppReminder(appointment, clients);
  };

  // Create the render status button function using our updated method
  const renderStatusButton = createRenderStatusButton(updateAppointmentStatus);

  // Generate week days for week view
  const weekDays = generateWeekDays(weekStartDate);

  return (
    <div className="space-y-6">
      {/* Header with title and new button */}
      <AgendaHeader
        currentDate={currentDate}
        weekStartDate={weekStartDate}
        monthStartDate={monthStartDate}
        currentView={currentView}
        setView={setView}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      />

      {/* Status Filter */}
      <AgendaStatusFilter 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter}
      />

      {/* Month View */}
      {currentView === 'month' && (
        <AgendaMonthView
          generateMonthDays={() => Promise.resolve(generateMonthDays(monthStartDate))}
          loading={loading}
          getAppointmentsForDay={(date) => getAppointmentsForDay(date, filteredAppointments)}
          formatTime={formatTime}
          setCurrentDate={setCurrentDate}
          setView={setView}
        />
      )}

      {/* Week View */}
      {currentView === 'week' && (
        <AgendaWeekView
          weekDays={weekDays}
          loading={loading}
          getAppointmentsForDay={(date) => getAppointmentsForDay(date, filteredAppointments)}
          formatTime={formatTime}
          renderStatusBadge={renderStatusBadge}
          setCurrentDate={setCurrentDate}
          setView={setView}
        />
      )}

      {/* Day View */}
      {currentView === 'day' && (
        <AgendaDayView
          loading={loading}
          filteredAppointments={filteredAppointments}
          statusFilter={statusFilter}
          statusConfig={statusConfig}
          formatTime={formatTime}
          getLocationText={getLocationText}
          renderStatusButton={renderStatusButton}
          sendWhatsAppReminder={handleSendWhatsAppReminder}
          navigateToFinancialRecord={navigateToFinancialRecord}
          setStatusFilter={setStatusFilter}
        />
      )}
    </div>
  );
};

export default Agenda;
