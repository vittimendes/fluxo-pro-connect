
// @file AppointmentDataLoader.tsx
// Component to load and provide appointment form data

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockDataService, Client, AppointmentType } from '@/services/mockData';

// @types Component props
interface AppointmentDataLoaderProps {
  children: (props: {
    clients: Client[];
    appointmentTypes: AppointmentType[];
    loading: boolean;
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
    setFormData: React.Dispatch<React.SetStateAction<{
      clientId: string;
      clientName: string;
      type: string;
      date: Date;
      time: string;
      duration: string;
      location: string;
      notes: string;
      status: string;
    }>>;
    isSubmitting: boolean;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    handleDateChange: (date: Date | undefined) => void;
  }) => React.ReactNode;
}

// @component Appointment data loader
export const AppointmentDataLoader: React.FC<AppointmentDataLoaderProps> = ({ children }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // @state Form data
  const [clients, setClients] = useState<Client[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
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

  // @effect Load clients and appointment types
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

  // @handler Form input handlers
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

  // @render Provide data to children
  return (
    <>
      {children({
        clients,
        appointmentTypes,
        loading,
        formData,
        setFormData,
        isSubmitting,
        setIsSubmitting,
        handleInputChange,
        handleSelectChange,
        handleDateChange,
      })}
    </>
  );
};
