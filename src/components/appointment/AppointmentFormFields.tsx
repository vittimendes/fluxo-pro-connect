
import React from 'react';
import { Client, AppointmentType } from '@/services/types';
import AppointmentClientField from './AppointmentClientField';
import AppointmentTypeField from './AppointmentTypeField';
import AppointmentDateTimeFields from './AppointmentDateTimeFields';
import AppointmentDurationLocationFields from './AppointmentDurationLocationFields';
import AppointmentStatusField from './AppointmentStatusField';
import AppointmentNotesField from './AppointmentNotesField';

interface AppointmentFormFieldsProps {
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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
}

const AppointmentFormFields: React.FC<AppointmentFormFieldsProps> = ({
  clients,
  appointmentTypes,
  formData,
  onInputChange,
  onSelectChange,
  onDateChange,
}) => {
  // Convert string date to Date object if needed
  const dateValue = typeof formData.date === 'string' 
    ? new Date(formData.date) 
    : formData.date;

  return (
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
        date={dateValue}
        time={formData.time}
        onDateChange={onDateChange}
        onTimeChange={onInputChange}
      />

      <AppointmentDurationLocationFields
        duration={String(formData.duration)}
        location={formData.location}
        onDurationChange={onInputChange}
        onLocationChange={(value) => onSelectChange('location', value)}
      />

      <AppointmentStatusField 
        status={formData.status} 
        onChange={(value) => onSelectChange('status', value)} 
      />

      <AppointmentNotesField 
        notes={formData.notes || ''} 
        onChange={onInputChange} 
      />
    </>
  );
};

export default AppointmentFormFields;
