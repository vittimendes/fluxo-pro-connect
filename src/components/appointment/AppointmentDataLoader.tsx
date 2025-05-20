
import React, { useState, useEffect } from 'react';
import { useClientRepository } from '@/hooks/use-client-repository';
import { appointmentTypeService } from '@/services/appointmentTypeService';
import { AppointmentType, Client } from '@/services/types';
import { AppointmentFormData } from '@/types/forms';

interface AppointmentDataLoaderProps {
  children: (props: {
    clients: Client[];
    appointmentTypes: AppointmentType[];
    loading: boolean;
    formData: AppointmentFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    handleDateChange: (date: Date | undefined) => void;
  }) => React.ReactNode;
}

export const AppointmentDataLoader: React.FC<AppointmentDataLoaderProps> = ({ children }) => {
  // State management for clients and appointment types
  const { clients, loading: clientsLoading } = useClientRepository();
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientId: '',
    clientName: '',
    type: '',
    date: new Date(),
    time: '09:00',
    duration: 50,
    location: 'online',
    status: 'scheduled',
    notes: ''
  });

  // Load appointment types on component mount
  useEffect(() => {
    const fetchAppointmentTypes = async () => {
      try {
        const types = await appointmentTypeService.getAppointmentTypes();
        setAppointmentTypes(types);
      } catch (error) {
        console.error('Error fetching appointment types:', error);
      } finally {
        setTypesLoading(false);
      }
    };

    fetchAppointmentTypes();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      // If client is selected, update clientName as well
      if (name === 'clientId') {
        const selectedClient = clients.find(client => client.id === value);
        return {
          ...prev,
          [name]: value,
          clientName: selectedClient?.name || ''
        };
      }
      return { ...prev, [name]: value };
    });
  };

  // Handle date picker changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const loading = clientsLoading || typesLoading;

  return (
    <>
      {children({
        clients,
        appointmentTypes,
        loading,
        formData,
        handleInputChange,
        handleSelectChange,
        handleDateChange
      })}
    </>
  );
};
