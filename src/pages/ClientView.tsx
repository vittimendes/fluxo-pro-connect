
// @file ClientView.tsx
// Client details page that displays comprehensive client information 
// along with their appointment history, financial records, and attachments.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, Appointment, FinancialRecord } from '@/services/types';
import { mockDataService } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarClock, CreditCard, Paperclip } from 'lucide-react';

// Import our components
import ClientHeader from '@/components/client/ClientHeader';
import AppointmentsList from '@/components/client/AppointmentsList';
import FinancialRecordsList from '@/components/client/FinancialRecordsList';
import ClientAttachments from '@/components/client/ClientAttachments';

const ClientView = () => {
  // @section State management
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);

  // @effect Load client data and related information
  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        if (!id) return;
        
        // @api Fetch client data
        const clientData = await mockDataService.getClientById(id);
        if (!clientData) {
          // @event Handle client not found
          toast({
            title: "Cliente não encontrado",
            description: "O cliente solicitado não foi encontrado.",
            variant: "destructive"
          });
          navigate('/clientes');
          return;
        }
        
        setClient(clientData);
        
        // @api Fetch client appointments
        const clientAppointments = await mockDataService.getAppointmentsByClientId(id);
        
        // @utility Sort appointments by date (newest first)
        const sortedAppointments = [...clientAppointments].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateB.getTime() - dateA.getTime();
        });
        
        setAppointments(sortedAppointments);
        
        // @api Fetch client financial records
        const clientRecords = await mockDataService.getFinancialRecordsByClientId(id);
        
        // @utility Sort financial records by date (newest first)
        const sortedRecords = [...clientRecords].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setFinancialRecords(sortedRecords);
        
      } catch (error) {
        // @event Handle data fetching error
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

  // @component Loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // @component Client not found view
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
      {/* @component Back navigation button */}
      <Button 
        variant="ghost" 
        className="gap-2 pl-1"
        onClick={() => navigate('/clientes')}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      {/* @component Client information header */}
      <ClientHeader client={client} />

      {/* @section Client tabs for different data views */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="appointments" className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4" /> Atendimentos
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" /> Financeiro
          </TabsTrigger>
          <TabsTrigger value="attachments" className="flex items-center gap-1">
            <Paperclip className="h-4 w-4" /> Anexos
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
        
        <TabsContent value="attachments" className="space-y-4">
          <h3 className="text-lg font-medium">Anexos</h3>
          <ClientAttachments 
            clientId={client.id} 
            appointments={appointments.map(app => ({
              id: app.id,
              date: app.date,
              type: app.type
            }))} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientView;
