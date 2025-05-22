
import React from 'react';
import { Client, AppointmentType } from '@/services/types';
import FormContainer from './FormContainer';
import AppointmentFormFields from './AppointmentFormFields';
import AppointmentFormActions from './AppointmentFormActions';

interface AppointmentFormProps {
  clients: Client[];
  appointmentTypes: AppointmentType[];
  formData: {
    clientId: string;
    clientName: string;
    type: string;
    date: Date | string; // Accept either Date or string
    time: string;
    duration: string | number;
    location: string;
    notes?: string;
    status: string;
  };
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  clients,
  appointmentTypes,
  formData,
  isSubmitting,
  onInputChange,
  onSelectChange,
  onDateChange,
  onSubmit,
}) => {
  return (
    <FormContainer 
      title="Informações do Agendamento" 
      onSubmit={onSubmit}
      footer={
        <AppointmentFormActions isSubmitting={isSubmitting} />
      }
    >
      <AppointmentFormFields 
        clients={clients}
        appointmentTypes={appointmentTypes}
        formData={formData}
        onInputChange={onInputChange}
        onSelectChange={onSelectChange}
        onDateChange={onDateChange}
      />
    </FormContainer>
  );
};

export default AppointmentForm;
