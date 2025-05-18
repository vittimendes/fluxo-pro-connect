
// @file AppointmentView.tsx
// Appointment details page that displays comprehensive appointment information
// with options to edit, change status, or delete the appointment.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Appointment, FinancialRecord, AppointmentType, Client, mockDataService } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AppointmentDetails from '@/components/appointment/AppointmentDetails';
import AppointmentFinancialRecords from '@/components/appointment/AppointmentFinancialRecords';
import AppointmentForm from '@/components/appointment/AppointmentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from 'date-fns';

const AppointmentView = () => {
  // @section State management
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [relatedRecords, setRelatedRecords] = useState<FinancialRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // @section Form state
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    type: '',
    date: new Date(),
    time: '',
    duration: '',
    location: '',
    notes: '',
    status: ''
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // @effect Load appointment and related data
  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      try {
        if (!id) return;
        
        // @api Get appointment data
        const appointments = await mockDataService.getAppointments();
        const foundAppointment = appointments.find(app => app.id === id);
        
        // @api Fetch clients and appointment types for edit form
        const clientsData = await mockDataService.getClients();
        const typesData = await mockDataService.getAppointmentTypes();
        
        setClients(clientsData);
        setAppointmentTypes(typesData);
        
        if (foundAppointment) {
          setAppointment(foundAppointment);
          
          // @function Initialize form data with appointment values
          setFormData({
            clientId: foundAppointment.clientId,
            clientName: foundAppointment.clientName,
            type: foundAppointment.type,
            date: parseISO(foundAppointment.date),
            time: foundAppointment.time,
            duration: String(foundAppointment.duration),
            location: foundAppointment.location,
            notes: foundAppointment.notes || '',
            status: foundAppointment.status
          });
          
          // @api Get related financial records
          const records = await mockDataService.getFinancialRecordsByAppointment(id);
          setRelatedRecords(records);
        } else {
          // @event Handle appointment not found
          toast({
            title: "Erro",
            description: "Atendimento não encontrado.",
            variant: "destructive"
          });
          navigate('/agenda');
        }
      } catch (error) {
        // @event Handle error fetching appointment
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

  // @function Update appointment status
  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    
    setStatusLoading(true);
    try {
      // @api Update appointment status
      const updatedAppointment = await mockDataService.updateAppointment(
        appointment.id, 
        { status: newStatus as Appointment['status'] }
      );
      
      setAppointment(updatedAppointment);
      setFormData(prev => ({
        ...prev,
        status: newStatus
      }));
      
      toast({
        title: "Status atualizado",
        description: `Status alterado com sucesso.`,
      });
    } catch (error) {
      // @event Handle status update error
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
  
  // @function Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // @function Handle select field changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If changing client, update clientName
    if (name === 'clientId') {
      const selectedClient = clients.find(client => client.id === value);
      if (selectedClient) {
        setFormData(prev => ({ ...prev, clientName: selectedClient.name }));
      }
    }
  };

  // @function Handle date field changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  // @function Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    
    setIsSubmitting(true);
    try {
      // Format date for API
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      
      // @api Update appointment
      const updatedAppointment = await mockDataService.updateAppointment(appointment.id, {
        clientId: formData.clientId,
        clientName: formData.clientName,
        type: formData.type,
        date: formattedDate,
        time: formData.time,
        duration: parseInt(formData.duration),
        location: formData.location as 'online' | 'in_person' | 'home_visit',
        notes: formData.notes,
        status: formData.status as Appointment['status']
      });
      
      setAppointment(updatedAppointment);
      setIsEditing(false);
      
      toast({
        title: "Agendamento atualizado",
        description: "As alterações foram salvas com sucesso."
      });
    } catch (error) {
      // @event Handle update error
      console.error("Error updating appointment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o agendamento.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // @function Delete appointment
  const handleDeleteAppointment = async () => {
    if (!appointment) return;
    
    try {
      // @api Delete appointment
      await mockDataService.deleteAppointment(appointment.id);
      
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi removido com sucesso."
      });
      
      navigate('/agenda');
    } catch (error) {
      // @event Handle deletion error
      console.error("Error deleting appointment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o agendamento.",
        variant: "destructive"
      });
    }
  };

  // @component Loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // @component Appointment not found view
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
      {/* @component Navigation and action buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/agenda')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}
      </div>

      {/* @section Appointment view/edit tabs */}
      <Tabs value={isEditing ? "edit" : "view"}>
        <TabsContent value="view" className="space-y-6 mt-0">
          <AppointmentDetails 
            appointment={appointment}
            onStatusChange={handleStatusChange}
            statusLoading={statusLoading}
            hasFinancialRecords={relatedRecords.length > 0}
            onDeleteAppointment={handleDeleteAppointment}
          />

          <AppointmentFinancialRecords records={relatedRecords} />
        </TabsContent>
        
        <TabsContent value="edit" className="space-y-6 mt-0">
          <AppointmentForm
            clients={clients}
            appointmentTypes={appointmentTypes}
            formData={formData}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onDateChange={handleDateChange}
            onSubmit={handleSubmit}
          />
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
              Cancelar
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentView;
