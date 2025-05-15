
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment, mockDataService } from '@/services/mockData';
import { Calendar, Clock, Wallet, Plus, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get today's appointments
        const todayAppointments = await mockDataService.getTodayAppointments();
        setAppointments(todayAppointments);

        // Get current month's financial summary
        const currentDate = new Date();
        const summary = await mockDataService.getMonthlyFinancialSummary(
          currentDate.getMonth(),
          currentDate.getFullYear()
        );
        setFinancialSummary(summary);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format appointment time for display (9:00 -> 09:00)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'online':
        return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'in_person':
        return <MapPin className="h-4 w-4 text-green-500" />;
      case 'home_visit':
        return <MapPin className="h-4 w-4 text-orange-500" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

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

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Olá, {user?.name?.split(' ')[0]}
        </h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => navigate('/agenda/novo')}
          className="flex items-center justify-center gap-2 py-6"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Agendamento</span>
        </Button>
        <Button
          onClick={() => navigate('/financeiro/novo')}
          className="flex items-center justify-center gap-2 py-6"
          variant="outline"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Receita</span>
        </Button>
      </div>

      {/* Finance Summary Card */}
      <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
          <CardDescription>Mês atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Receitas</p>
              <p className="text-green-600 font-semibold">
                R$ {financialSummary.income.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Despesas</p>
              <p className="text-red-600 font-semibold">
                R$ {financialSummary.expenses.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Saldo</p>
              <p className={`font-semibold ${financialSummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {financialSummary.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendamentos de Hoje
          </h3>
          <Button
            variant="link"
            onClick={() => navigate('/agenda')}
            className="p-0 h-auto text-primary"
          >
            Ver todos
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
            <p>Carregando agendamentos...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <User className="h-4 w-4 mr-1" />
                        <span className="font-medium">{appointment.clientName}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTime(appointment.time)} - {appointment.duration} min</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {getLocationIcon(appointment.location)}
                        <span className="ml-1">{getLocationText(appointment.location)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-primary-muted text-primary text-xs px-2 py-1 rounded-full">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>Não há agendamentos para hoje.</p>
              <Button 
                variant="link" 
                onClick={() => navigate('/agenda/novo')}
                className="text-primary mt-2"
              >
                Criar novo agendamento
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
