
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Appointment, FinancialRecord, AppointmentType, Client, mockDataService } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AppointmentViewDataLoaderProps {
  children: (props: {
    appointment: Appointment | null;
    loading: boolean;
    statusLoading: boolean;
    setStatusLoading: React.Dispatch<React.SetStateAction<boolean>>;
    relatedRecords: FinancialRecord[];
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    clients: Client[];
    appointmentTypes: AppointmentType[];
    formData: {
      clientId: string;
      clientName: string;
      type: string;
      date: Date;
      time: string;
      duration: string;
      location: string;
      notes: string;
      status: string;
    };
    isSubmitting: boolean;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    handleDateChange: (date: Date | undefined) => void;
    handleStatusChange: (newStatus: string) => Promise<void>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleDeleteAppointment: () => Promise<void>;
  }) => React.ReactNode;
}

export const AppointmentViewDataLoader: React.FC<AppointmentViewDataLoaderProps> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [relatedRecords, setRelatedRecords] = useState<FinancialRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Load appointment and related data
  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      try {
        if (!id) return;
        
        // Get appointment data
        const appointments = await mockDataService.getAppointments();
        const foundAppointment = appointments.find(app => app.id === id);
        
        // Fetch clients and appointment types for edit form
        const clientsData = await mockDataService.getClients();
        const typesData = await mockDataService.getAppointmentTypes();
        
        setClients(clientsData);
        setAppointmentTypes(typesData);
        
        if (foundAppointment) {
          setAppointment(foundAppointment);
          
          // Initialize form data with appointment values
          setFormData({
            clientId: foundAppointment.clientId,
            clientName: foundAppointment.clientName,
            type: foundAppointment.type,
            date: new Date(foundAppointment.date),
            time: foundAppointment.time,
            duration: String(foundAppointment.duration),
            location: foundAppointment.location,
            notes: foundAppointment.notes || '',
            status: foundAppointment.status
          });
          
          // Get related financial records
          const records = await mockDataService.getFinancialRecordsByAppointment(id);
          setRelatedRecords(records);
        } else {
          toast({
            title: "Erro",
            description: "Atendimento não encontrado.",
            variant: "destructive"
          });
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

  // Form input handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  // Update appointment status
  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    
    setStatusLoading(true);
    try {
      const updatedAppointment = await mockDataService.updateAppointment(
        appointment.id, 
        { status: newStatus as Appointment['status'] }
      );
      
      setAppointment(updatedAppointment);
      setFormData(prev => ({ ...prev, status: newStatus }));
      
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

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    
    setIsSubmitting(true);
    try {
      // Format date for API
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      
      // Update appointment
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
  
  // Delete appointment
  const handleDeleteAppointment = async () => {
    if (!appointment) return;
    
    try {
      await mockDataService.deleteAppointment(appointment.id);
      
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi removido com sucesso."
      });
      
      navigate('/agenda');
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o agendamento.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {children({
        appointment,
        loading,
        statusLoading,
        setStatusLoading,
        relatedRecords,
        isEditing,
        setIsEditing,
        clients,
        appointmentTypes,
        formData,
        isSubmitting,
        setIsSubmitting,
        handleInputChange,
        handleSelectChange,
        handleDateChange,
        handleStatusChange,
        handleSubmit,
        handleDeleteAppointment
      })}
    </>
  );
};
