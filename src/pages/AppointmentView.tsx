
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Appointment, FinancialRecord, mockDataService } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AppointmentDetails from '@/components/appointment/AppointmentDetails';
import AppointmentStatusSelector from '@/components/appointment/AppointmentStatusSelector';
import AppointmentFinancialRecords from '@/components/appointment/AppointmentFinancialRecords';
import ExecuteAppointmentDialog from '@/components/appointment/ExecuteAppointmentDialog';

const AppointmentView = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [relatedRecords, setRelatedRecords] = useState<FinancialRecord[]>([]);
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);
  const [financialRecord, setFinancialRecord] = useState({
    amount: 0,
    description: '',
    type: 'income' as 'income' | 'expense'
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      try {
        if (!id) return;
        
        // Get all appointments (the mock service filters by current user)
        const appointments = await mockDataService.getAppointments();
        const foundAppointment = appointments.find(app => app.id === id);
        
        if (foundAppointment) {
          setAppointment(foundAppointment);
          
          // Get related financial records
          const records = await mockDataService.getFinancialRecordsByAppointment(id);
          setRelatedRecords(records);
        } else {
          toast({
            title: "Erro",
            description: "Atendimento não encontrado.",
            variant: "destructive"
          });
          navigate('/agenda');
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do atendimento.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, navigate, toast]);

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    
    setStatusLoading(true);
    try {
      const updatedAppointment = await mockDataService.updateAppointment(
        appointment.id, 
        { status: newStatus as Appointment['status'] }
      );
      
      setAppointment(updatedAppointment);
      
      toast({
        title: "Status atualizado",
        description: `Status alterado com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do atendimento.",
        variant: "destructive"
      });
    } finally {
      setStatusLoading(false);
    }
  };
  
  const handleExecuteAppointment = async () => {
    if (!appointment) return;
    
    try {
      // Only create a financial record if amount > 0
      const result = financialRecord.amount > 0 
        ? await mockDataService.executeAppointment(appointment.id, financialRecord)
        : await mockDataService.executeAppointment(appointment.id);
      
      setAppointment(result.appointment);
      
      if (result.financialRecord) {
        setRelatedRecords(prev => [...prev, result.financialRecord!]);
      }
      
      toast({
        title: "Atendimento executado",
        description: "Atendimento marcado como concluído com sucesso.",
      });
      
      setExecuteDialogOpen(false);
    } catch (error) {
      console.error("Error executing appointment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível executar o atendimento.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground">Atendimento não encontrado</p>
        <Button onClick={() => navigate('/agenda')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para Agenda
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" onClick={() => navigate('/agenda')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      </div>

      <AppointmentDetails 
        appointment={appointment} 
        onExecuteClick={() => setExecuteDialogOpen(true)}
        onStatusChange={handleStatusChange}
        statusLoading={statusLoading}
      />

      <AppointmentFinancialRecords records={relatedRecords} />
      
      <ExecuteAppointmentDialog
        open={executeDialogOpen}
        onOpenChange={setExecuteDialogOpen}
        onExecute={handleExecuteAppointment}
        appointment={{
          id: appointment.id,
          clientName: appointment.clientName
        }}
      />
    </div>
  );
};

export default AppointmentView;
