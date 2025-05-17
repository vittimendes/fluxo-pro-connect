import { useState, useEffect } from 'react';
import { 
  format, 
  startOfWeek,
  startOfMonth, 
  endOfMonth, 
  addDays 
} from 'date-fns';
import { mockDataService, Appointment } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function useAgenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');
  const [weekStartDate, setWeekStartDate] = useState<Date>(startOfWeek(currentDate, { weekStartsOn: 0 }));
  const [monthStartDate, setMonthStartDate] = useState<Date>(startOfMonth(currentDate));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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

  // Create a financial record for an appointment
  const navigateToFinancialRecord = (appointment: Appointment) => {
    navigate(`/financeiro/novo?appointmentId=${appointment.id}`);
  };

  return {
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
  };
}
