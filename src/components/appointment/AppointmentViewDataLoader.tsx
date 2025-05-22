import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Appointment, FinancialRecord, AppointmentType, Client } from '@/services/types';
import { useAppointmentRepository } from '@/hooks/use-appointment-repository';
import { useClientRepository } from '@/hooks/use-client-repository';
import { useFinancialRepository } from '@/hooks/use-financial-repository';
import { appointmentTypeService } from '@/services/appointmentTypeService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AppointmentFormData } from '@/types/forms';

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
      date: string; // Change from Date to string
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
    date: '', // Change to string
    time: '',
    duration: '',
    location: '',
    notes: '',
    status: ''
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Repository hooks
  const { appointments, loading: appointmentsLoading, updateAppointment, deleteAppointment } = useAppointmentRepository();
  const { clients: clientsData, loading: clientsLoading } = useClientRepository();
  const { records, loading: recordsLoading } = useFinancialRepository();

  // Load appointment and related data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) return;
        // Find appointment from loaded appointments
        const foundAppointment = appointments.find(app => app.id === id);
        // Fetch appointment types from service
        const typesData = await appointmentTypeService.getAppointmentTypes();
        setAppointmentTypes(typesData);
        setClients(clientsData);
        if (foundAppointment) {
          setAppointment(foundAppointment);
          setFormData({
            clientId: foundAppointment.clientId,
            clientName: foundAppointment.clientName,
            type: foundAppointment.type,
            date: foundAppointment.date, // Already a string
            time: foundAppointment.time,
            duration: String(foundAppointment.duration),
            location: foundAppointment.location,
            notes: foundAppointment.notes || '',
            status: foundAppointment.status
          });
          // Filter related financial records
          const related = records.filter(r => r.appointmentId === id);
          setRelatedRecords(related);
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
    fetchData();
  }, [id, appointments, clientsData, records, toast]);

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
      setFormData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
    }
  };

  // Update appointment status
  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    setStatusLoading(true);
    try {
      // Build AppointmentFormData
      const formData: AppointmentFormData = {
        clientId: appointment.clientId,
        clientName: appointment.clientName,
        type: appointment.type,
        date: new Date(appointment.date),
        time: appointment.time,
        duration: appointment.duration,
        location: appointment.location,
        status: newStatus as Appointment['status'],
        notes: appointment.notes || '',
      };
      const updated = await updateAppointment(appointment.id, formData);
      if (updated) {
        setAppointment({ ...appointment, status: newStatus as Appointment['status'] });
        setFormData(prev => ({ ...prev, status: newStatus }));
        toast({
          title: "Status atualizado",
          description: `Status alterado com sucesso.`,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro ao atualizar status",
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
      // Use Date object for date
      const updated = await updateAppointment(appointment.id, {
        clientId: formData.clientId,
        clientName: formData.clientName,
        type: formData.type,
        date: new Date(formData.date), // Convert string to Date
        time: formData.time,
        duration: parseInt(formData.duration),
        location: formData.location as 'online' | 'in_person' | 'home_visit',
        notes: formData.notes,
        status: formData.status as Appointment['status']
      });
      if (updated) {
        setAppointment({
          ...appointment,
          clientId: formData.clientId,
          clientName: formData.clientName,
          type: formData.type,
          date: formData.date, // Now a string
          time: formData.time,
          duration: parseInt(formData.duration),
          location: formData.location as 'online' | 'in_person' | 'home_visit',
          notes: formData.notes,
          status: formData.status as Appointment['status']
        });
        setIsEditing(false);
        toast({
          title: "Agendamento atualizado",
          description: "As alterações foram salvas com sucesso."
        });
      }
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
      await deleteAppointment(appointment.id);
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
