
import React from 'react';
import { Client, AppointmentType } from '@/services/types';
import FormContainer from './FormContainer';
import AppointmentClientField from './AppointmentClientField';
import AppointmentTypeField from './AppointmentTypeField';
import AppointmentDateTimeFields from './AppointmentDateTimeFields';
import AppointmentDurationLocationFields from './AppointmentDurationLocationFields';
import AppointmentStatusField from './AppointmentStatusField';
import AppointmentNotesField from './AppointmentNotesField';
import AppointmentFormActions from './AppointmentFormActions';

interface AppointmentFormProps {
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
      <AppointmentFields 
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

// Helper component to organize form fields
interface AppointmentFieldsProps {
  clients: Client[];
  appointmentTypes: AppointmentType[];
  formData: AppointmentFormProps['formData'];
  onInputChange: AppointmentFormProps['onInputChange'];
  onSelectChange: AppointmentFormProps['onSelectChange'];
  onDateChange: AppointmentFormProps['onDateChange'];
}

const AppointmentFields: React.FC<AppointmentFieldsProps> = ({
  clients,
  appointmentTypes,
  formData,
  onInputChange,
  onSelectChange,
  onDateChange,
}) => (
  <>
    <AppointmentClientField 
      clients={clients} 
      value={formData.clientId} 
      onChange={(value) => onSelectChange('clientId', value)} 
    />

    <AppointmentTypeField 
      appointmentTypes={appointmentTypes} 
      value={formData.type} 
      onChange={(value) => onSelectChange('type', value)} 
    />

    <AppointmentDateTimeFields 
      date={formData.date} 
      time={formData.time}
      onDateChange={onDateChange}
      onTimeChange={onInputChange}
    />

    <AppointmentDurationLocationFields
      duration={formData.duration}
      location={formData.location}
      onDurationChange={onInputChange}
      onLocationChange={(value) => onSelectChange('location', value)}
    />

    <AppointmentStatusField 
      status={formData.status} 
      onChange={(value) => onSelectChange('status', value)} 
    />

    <AppointmentNotesField 
      notes={formData.notes} 
      onChange={onInputChange} 
    />
  </>
);

export default AppointmentForm;
