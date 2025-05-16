import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays, format, getDay, isSameDay, parseISO, startOfWeek, startOfMonth, endOfMonth, getDaysInMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockDataService, Appointment, Client } from '@/services/mockData';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  MapPin, 
  MessageSquare, 
  Lock,
  CheckCircle2,
  XCircle,
  Clock8,
  AlertCircle,
  DollarSign,
  FilterX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusOptions } from '@/components/appointment/AppointmentStatusUtils';

// Define appointment status properties with improved styling
type StatusConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
};

const statusConfig: Record<string, StatusConfig> = {
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

  // Format appointment time (9:00 -> 09:00)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
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

  // Helper to get location text
  const getLocationText = (location: string): string => {
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

  // Check if feature is locked (premium)
  const isFeatureLocked = (featureName: string): boolean => {
    // For this demo, let's assume certain features are premium
    const premiumFeatures = ['export', 'bulk_reminder', 'recurring'];
    return premiumFeatures.includes(featureName);
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

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const config = statusConfig[status];
    if (!config) return null;

    return (
      <div className={`flex items-center gap-1 ${config.color} text-xs font-medium py-0.5 px-1.5 rounded-full`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };

  // Render status dropdown button with appropriate styling
  const renderStatusButton = (appointment: Appointment) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Agenda</h2>
        <Button onClick={() => navigate('/agenda/novo')} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
      </div>

      {/* View toggle and navigation */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant={currentView === 'day' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView('day')}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Dia
            </Button>
            <Button 
              variant={currentView === 'week' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView('week')}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Semana
            </Button>
            <Button 
              variant={currentView === 'month' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView('month')}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Mês
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentView === 'day' ? (
                format(currentDate, "dd 'de' MMMM", { locale: ptBR })
              ) : currentView === 'week' ? (
                `${format(weekStartDate, "dd/MM", { locale: ptBR })} - ${format(
                  addDays(weekStartDate, 6),
                  "dd/MM",
                  { locale: ptBR }
                )}`
              ) : (
                format(monthStartDate, "MMMM 'de' yyyy", { locale: ptBR })
              )}
            </span>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filtrar por:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status">
                  {statusFilter === "all" ? (
                    <div className="flex items-center gap-2">
                      <FilterX className="h-4 w-4" />
                      <span>Todos</span>
                    </div>
                  ) : (
                    (() => {
                      const option = statusOptions.find(s => s.value === statusFilter) || statusOptions[0];
                      const StatusIcon = option.icon;
                      return (
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      );
                    })()
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <FilterX className="h-4 w-4" />
                    <span>Todos</span>
                  </div>
                </SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Premium Features Section */}
          <div className="flex justify-end items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled className="opacity-70">
                    <Lock className="h-3 w-3 mr-1" /> Exportar Agenda
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disponível no plano premium</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled className="opacity-70">
                    <Lock className="h-3 w-3 mr-1" /> Lembretes em Massa
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disponível no plano premium</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Month View */}
        {currentView === 'month' && (
          <div className="grid grid-cols-7 gap-1 text-xs">
            {/* Day headers */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
              <div key={`header-${i}`} className="text-center p-1 font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {generateMonthDays().map((day, index) => (
              <div 
                key={`day-${index}`} 
                className={`
                  min-h-[80px] border p-1 ${day.isCurrentMonth ? 
                    (isSameDay(day.date, new Date()) ? 'bg-primary/10 border-primary' : 'bg-card') : 
                    'bg-muted/20 opacity-50'} 
                  text-center cursor-pointer hover:bg-muted/10 overflow-hidden
                `}
                onClick={() => {
                  setCurrentDate(day.date);
                  setView('day');
                }}
              >
                <div className={`
                  text-right font-medium mb-1 
                  ${isSameDay(day.date, new Date()) ? 'text-primary' : ''}
                `}>
                  {format(day.date, 'd')}
                </div>
                <div className="overflow-y-auto max-h-[60px]">
                  {loading ? (
                    <div className="animate-pulse h-2 bg-muted rounded my-1"></div>
                  ) : (
                    getAppointmentsForDay(day.date).slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/agenda/${app.id}`);
                        }}
                        className="text-left text-[10px] truncate py-0.5 px-1 mb-0.5 rounded bg-primary/10 hover:bg-primary/20"
                      >
                        {formatTime(app.time)} {app.clientName}
                      </div>
                    ))
                  )}
                  {getAppointmentsForDay(day.date).length > 3 && (
                    <div className="text-[10px] text-muted-foreground text-center">
                      +{getAppointmentsForDay(day.date).length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendar View (Week) */}
        {currentView === 'week' && (
          <div className="grid grid-cols-7 gap-1 text-xs">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col">
                <div 
                  className={`
                    p-1 text-center font-medium mb-1 rounded-t-md
                    ${isSameDay(day, new Date()) ? 'bg-primary text-white' : 'bg-gray-100'}
                  `}
                >
                  <div>{format(day, 'EEE', { locale: ptBR })}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                </div>
                <div className="overflow-hidden h-64 overflow-y-auto bg-gray-50 rounded-b-md">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-primary"></div>
                    </div>
                  ) : (
                    <>
                      {getAppointmentsForDay(day).length > 0 ? (
                        getAppointmentsForDay(day).map((app) => (
                          <div 
                            key={app.id}
                            className="p-1 mb-1 bg-white rounded border-l-4 border-primary text-xs cursor-pointer hover:bg-gray-50"
                            onClick={() => navigate(`/agenda/${app.id}`)}
                          >
                            <div className="font-semibold truncate">{formatTime(app.time)}</div>
                            <div className="truncate">{app.clientName}</div>
                            <div className="mt-1">{renderStatusBadge(app.status)}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-1 text-center text-muted-foreground">
                          Vazio
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Day View */}
        {currentView === 'day' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="space-y-3">
                {filteredAppointments.map(appointment => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/agenda/${appointment.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">
                              {formatTime(appointment.time)} - {appointment.duration} min
                            </span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">{appointment.clientName}</span>
                          </div>
                          <div className="flex">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{getLocationText(appointment.location)}</span>
                          </div>
                          <div className="inline-block bg-primary-muted text-primary text-xs px-2 py-0.5 rounded-full">
                            {appointment.type}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs h-8 whitespace-nowrap"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/agenda/${appointment.id}`);
                            }}
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
                          
                          {/* Updated Status Dropdown */}
                          {(() => {
                            const statusButton = renderStatusButton(appointment);
                            return (
                              <span onClick={(e) => e.stopPropagation()}>
                                {statusButton}
                              </span>
                            );
                          })()}
                          
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-3">
                  {statusFilter !== "all" 
                    ? `Não há agendamentos com status '${statusOptions.find(s => s.value === statusFilter)?.label}' para esta data.` 
                    : "Não há agendamentos para esta data."}
                </p>
                <div className="flex justify-center gap-3">
                  {statusFilter !== "all" && (
                    <Button variant="outline" onClick={() => setStatusFilter("all")}>
                      <FilterX className="h-4 w-4 mr-1" /> Limpar Filtro
                    </Button>
                  )}
                  <Button onClick={() => navigate('/agenda/novo')}>
                    <Plus className="h-4 w-4 mr-1" /> Novo Agendamento
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
