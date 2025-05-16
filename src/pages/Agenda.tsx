import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  addDays, 
  format, 
  getDay, 
  parseISO, 
  startOfWeek, 
  startOfMonth, 
  endOfMonth, 
  getDaysInMonth 
} from 'date-fns';
import { mockDataService, Appointment, Client } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

// Import the refactored components
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
  createRenderStatusButton 
} from '@/components/agenda/AgendaUtils';

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');
  const [weekStartDate, setWeekStartDate] = useState<Date>(startOfWeek(currentDate, { weekStartsOn: 0 }));
  const [monthStartDate, setMonthStartDate] = useState<Date>(startOfMonth(currentDate));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch clients first so we have phone numbers
        const clientsData = await mockDataService.getClients();
        setClients(clientsData);
        
        if (currentView === 'day') {
          const formattedDate = format(currentDate, 'yyyy-MM-dd');
          const data = await mockDataService.getAppointmentsByDate(formattedDate);
          setAppointments(data);
        } else if (currentView === 'week') {
          const endDate = addDays(weekStartDate, 6);
          const data = await mockDataService.getAppointmentsByWeek(weekStartDate, endDate);
          setAppointments(data);
        } else if (currentView === 'month') {
          const endDate = endOfMonth(monthStartDate);
          // For month view, we need to get appointments for the entire month
          const data = await mockDataService.getAppointmentsByWeek(monthStartDate, endDate);
          setAppointments(data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Erro ao carregar agendamentos",
          description: "Não foi possível carregar os dados da agenda.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate, weekStartDate, monthStartDate, currentView, toast]);

  // Apply status filter when appointments or status filter changes
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter(app => app.status === statusFilter)
      );
    }
  }, [appointments, statusFilter]);

  // Move to previous/next day, week or month
  const handlePrevious = () => {
    if (currentView === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, -1));
    } else if (currentView === 'week') {
      setWeekStartDate(prevWeek => addDays(prevWeek, -7));
    } else if (currentView === 'month') {
      const newDate = new Date(monthStartDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setMonthStartDate(startOfMonth(newDate));
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (currentView === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, 1));
    } else if (currentView === 'week') {
      setWeekStartDate(prevWeek => addDays(prevWeek, 7));
    } else if (currentView === 'month') {
      const newDate = new Date(monthStartDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setMonthStartDate(startOfMonth(newDate));
      setCurrentDate(newDate);
    }
  };

  // Toggle between day, week and month view
  const setView = (view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
    if (view === 'day') {
      // Current date remains the same
    } else if (view === 'week') {
      setWeekStartDate(startOfWeek(currentDate, { weekStartsOn: 0 }));
    } else if (view === 'month') {
      setMonthStartDate(startOfMonth(currentDate));
    }
  };

  // Generate week day headers
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  // Generate month days grid
  const generateMonthDays = () => {
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
  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredAppointments.filter(app => app.date === dateStr);
  };

  // Get client phone number from the client list
  const getClientPhone = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client?.phone || "5511999999999"; // Default fallback if not found
  };

  // Send WhatsApp reminder
  const sendWhatsAppReminder = (appointment: Appointment) => {
    const phone = getClientPhone(appointment.clientId);
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

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const updatedAppointment = await mockDataService.updateAppointment(appointmentId, {
        status: status as 'scheduled' | 'confirmed' | 'canceled' | 'no_show' | 'completed'
      });
      
      // Update the local state to reflect the change
      setAppointments(prev => 
        prev.map(app => app.id === appointmentId ? updatedAppointment : app)
      );
      
      toast({
        title: "Status atualizado",
        description: `Status alterado para ${statusConfig[status].label}`,
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive"
      });
    }
  };

  // Create a financial record for an appointment
  const navigateToFinancialRecord = (appointment: Appointment) => {
    navigate(`/financeiro/novo?appointmentId=${appointment.id}`);
  };

  const renderStatusButton = createRenderStatusButton(updateAppointmentStatus);

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
          generateMonthDays={generateMonthDays}
          loading={loading}
          getAppointmentsForDay={getAppointmentsForDay}
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
          getAppointmentsForDay={getAppointmentsForDay}
          formatTime={formatTime}
          renderStatusBadge={renderStatusBadge}
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
          sendWhatsAppReminder={sendWhatsAppReminder}
          navigateToFinancialRecord={navigateToFinancialRecord}
          setStatusFilter={setStatusFilter}
        />
      )}
    </div>
  );
};

export default Agenda;
