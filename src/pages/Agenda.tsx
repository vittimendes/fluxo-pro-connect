
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays, format, getDay, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockDataService, Appointment, Client } from '@/services/mockData';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, User, MapPin, MessageSquare, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week'>('day');
  const [weekStartDate, setWeekStartDate] = useState<Date>(startOfWeek(currentDate, { weekStartsOn: 0 }));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
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
        } else {
          const endDate = addDays(weekStartDate, 6);
          const data = await mockDataService.getAppointmentsByWeek(weekStartDate, endDate);
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
  }, [currentDate, weekStartDate, currentView, toast]);

  // Move to previous/next day or week
  const handlePrevious = () => {
    if (currentView === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, -1));
    } else {
      setWeekStartDate(prevWeek => addDays(prevWeek, -7));
    }
  };

  const handleNext = () => {
    if (currentView === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, 1));
    } else {
      setWeekStartDate(prevWeek => addDays(prevWeek, 7));
    }
  };

  // Toggle between day and week view
  const toggleView = () => {
    if (currentView === 'day') {
      setCurrentView('week');
      setWeekStartDate(startOfWeek(currentDate, { weekStartsOn: 0 }));
    } else {
      setCurrentView('day');
    }
  };

  // Format appointment time (9:00 -> 09:00)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  // Generate week day headers
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  // Filter appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(app => app.date === dateStr);
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
          <Button variant="outline" size="sm" onClick={toggleView}>
            <CalendarIcon className="h-4 w-4 mr-1" />
            {currentView === 'day' ? 'Ver semana' : 'Ver dia'}
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentView === 'day' ? (
                format(currentDate, "dd 'de' MMMM", { locale: ptBR })
              ) : (
                `${format(weekStartDate, "dd/MM", { locale: ptBR })} - ${format(
                  addDays(weekStartDate, 6),
                  "dd/MM",
                  { locale: ptBR }
                )}`
              )}
            </span>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Premium Features Section */}
        <div className="flex justify-between items-center gap-2">
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
            ) : appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
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
                            onClick={() => navigate(`/agenda/${appointment.id}`)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => sendWhatsAppReminder(appointment)}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Lembrete
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
                  Não há agendamentos para esta data.
                </p>
                <Button onClick={() => navigate('/agenda/novo')}>
                  <Plus className="h-4 w-4 mr-1" /> Novo Agendamento
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
