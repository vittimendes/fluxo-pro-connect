
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, Appointment, FinancialRecord, mockDataService } from '@/services/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarClock, CreditCard } from 'lucide-react';

// Import our new components
import ClientHeader from '@/components/client/ClientHeader';
import AppointmentsList from '@/components/client/AppointmentsList';
import FinancialRecordsList from '@/components/client/FinancialRecordsList';

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
      <ClientHeader client={client} />

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
          <AppointmentsList appointments={appointments} clientId={client.id} />
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <h3 className="text-lg font-medium">Histórico Financeiro</h3>
          <FinancialRecordsList financialRecords={financialRecords} clientId={client.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientView;
