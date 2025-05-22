// @file Agenda.tsx
// Main agenda page that manages appointment display and interactions
// across different view modes (day, week, month).

import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Client, Appointment } from '@/services/mockData';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAgenda } from '@/hooks/use-agenda';
import { useAppointmentStatus } from '@/hooks/use-appointment-status';
import { useClientRepository } from '@/hooks/use-client-repository';

// @section Import shared utils and components
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
  // @section Hooks and state
  const isMobile = useIsMobile();
  const initialViewSet = useRef(false);
  const [clients, setClients] = useState<Client[]>([]);
  
  // @section Agenda state and utilities from custom hook
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
  
  // @section Appointment status management hook
  const { updateAppointmentStatus } = useAppointmentStatus(
    filteredAppointments,
    setFilteredAppointments
  );

  // @section Client repository
  const { clients: repoClients, loading: clientsLoading } = useClientRepository();

  // @effect Set default view to 'day' on mobile devices
  useEffect(() => {
    if (isMobile && !initialViewSet.current) {
      setView('day');
      initialViewSet.current = true;
    }
  }, [isMobile, setView]);

  // @effect Sync clients from repository
  useEffect(() => {
    setClients(repoClients);
  }, [repoClients]);

  // @event Send WhatsApp reminder with client data
  const handleSendWhatsAppReminder = (appointment: Appointment) => {
    sendWhatsAppReminder(appointment, clients);
  };

  // @function Create the status button component
  const renderStatusButton = createRenderStatusButton(updateAppointmentStatus);

  // @section Generate week days for week view
  const weekDays = generateWeekDays(weekStartDate);

  return (
    <div className="space-y-6">
      {/* @component Header with title, date navigation and view switcher */}
      <AgendaHeader
        currentDate={currentDate}
        weekStartDate={weekStartDate}
        monthStartDate={monthStartDate}
        currentView={currentView}
        setView={setView}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      />

      {/* @component Status filter toggles */}
      <AgendaStatusFilter 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter}
      />

      {/* @component Conditional rendering based on current view */}
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
