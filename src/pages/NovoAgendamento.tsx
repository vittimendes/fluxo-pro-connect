
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDataService, Client, AppointmentType } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { getCurrentUserId } from '@/services/utils';
import AppointmentFormHeader from '@/components/appointment/AppointmentFormHeader';
import AppointmentForm from '@/components/appointment/AppointmentForm';
import LoadingAppointmentForm from '@/components/appointment/LoadingAppointmentForm';

const NovoAgendamento = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    type: '',
    date: new Date(),
    time: '09:00',
    duration: '50',
    location: 'in_person',
    notes: '',
    status: 'scheduled',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientsData, typesData] = await Promise.all([
          mockDataService.getClients(),
          mockDataService.getAppointmentTypes()
        ]);
        
        setClients(clientsData);
        setAppointmentTypes(typesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados necessários.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // If selecting a client, also update the clientName
    if (name === 'clientId') {
      const selectedClient = clients.find(client => client.id === value);
      if (selectedClient) {
        setFormData(prev => ({ ...prev, clientName: selectedClient.name }));
      }
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.clientId || !formData.type) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, selecione um cliente e um tipo de atendimento.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const dateStr = format(formData.date, 'yyyy-MM-dd');
      
      await mockDataService.addAppointment({
        clientId: formData.clientId,
        clientName: formData.clientName,
        type: formData.type,
        date: dateStr,
        time: formData.time,
        duration: parseInt(formData.duration),
        location: formData.location as 'online' | 'in_person' | 'home_visit',
        status: formData.status as 'scheduled' | 'confirmed' | 'canceled' | 'no_show' | 'completed',
        notes: formData.notes,
        userId: getCurrentUserId() // Add required userId field
      });

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso!",
      });

      // Redirect back to agenda page
      navigate('/agenda');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AppointmentFormHeader />

      {loading ? (
        <LoadingAppointmentForm />
      ) : (
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
      )}
    </div>
  );
};

export default NovoAgendamento;
