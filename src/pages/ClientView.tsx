
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, Appointment, FinancialRecord, mockDataService } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, Mail, User, CalendarClock, CreditCard, TrendingUp, TrendingDown, Clock, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ClientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        if (!id) return;
        
        // Fetch client data
        const clientData = await mockDataService.getClientById(id);
        if (!clientData) {
          toast({
            title: "Cliente não encontrado",
            description: "O cliente solicitado não foi encontrado.",
            variant: "destructive"
          });
          navigate('/clientes');
          return;
        }
        
        setClient(clientData);
        
        // Fetch client appointments
        const clientAppointments = await mockDataService.getAppointmentsByClientId(id);
        
        // Sort appointments by date (newest first)
        const sortedAppointments = [...clientAppointments].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateB.getTime() - dateA.getTime();
        });
        
        setAppointments(sortedAppointments);
        
        // Fetch client financial records
        const clientRecords = await mockDataService.getFinancialRecordsByClientId(id);
        
        // Sort financial records by date (newest first)
        const sortedRecords = [...clientRecords].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setFinancialRecords(sortedRecords);
        
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível obter os dados do cliente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id, navigate, toast]);

  // Format appointment time for display
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount));
  };

  // Get location text
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
        <Button onClick={() => navigate('/clientes')} className="mt-4">
          Voltar para Clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="gap-2 pl-1"
        onClick={() => navigate('/clientes')}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      {/* Client Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>{client.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
            )}
          </div>
          
          {client.notes && (
            <div className="pt-2 border-t">
              <span className="text-muted-foreground block mb-1">Observações:</span>
              <p className="text-sm">{client.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/clientes/${client.id}/editar`)}
          >
            Editar
          </Button>
        </CardFooter>
      </Card>

      {/* Client History */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="appointments" className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4" /> Atendimentos
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" /> Financeiro
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="space-y-4">
          <h3 className="text-lg font-medium">Histórico de Atendimentos</h3>
          
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <Card 
                  key={appointment.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/agenda/${appointment.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium">{appointment.type}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          <span>
                            {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })} - {formatTime(appointment.time)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{appointment.duration} min</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{getLocationText(appointment.location)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span 
                          className={`text-xs px-2 py-1 rounded-full font-medium
                            ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                            ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                            ${appointment.status === 'canceled' ? 'bg-red-100 text-red-800' : ''}
                            ${appointment.status === 'completed' ? 'bg-purple-100 text-purple-800' : ''}
                          `}
                        >
                          {appointment.status === 'scheduled' && 'Agendado'}
                          {appointment.status === 'confirmed' && 'Confirmado'}
                          {appointment.status === 'canceled' && 'Cancelado'}
                          {appointment.status === 'completed' && 'Concluído'}
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
                <p>Este cliente não possui atendimentos registrados.</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/agenda/novo', { state: { clientId: client.id } })}
                  className="text-primary mt-2"
                >
                  Criar novo agendamento
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <h3 className="text-lg font-medium">Histórico Financeiro</h3>
          
          {financialRecords.length > 0 ? (
            <div className="space-y-3">
              {financialRecords.map((record) => (
                <Card
                  key={record.id}
                  className={`hover:shadow-md transition-shadow border-l-4 ${
                    record.type === 'income' ? 'border-l-green-500' : 'border-l-red-500'
                  } cursor-pointer`}
                  onClick={() => navigate(`/financeiro/${record.id}`)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        {record.type === 'income' ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className="font-medium">{record.description}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        <span>
                          {format(parseISO(record.date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${
                        record.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(record.amount)}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <p>Este cliente não possui registros financeiros.</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/financeiro/novo', { state: { clientId: client.id } })}
                  className="text-primary mt-2"
                >
                  Criar novo registro financeiro
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientView;
