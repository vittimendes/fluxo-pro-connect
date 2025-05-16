
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Client, AppointmentType } from '@/services/types';
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
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>Informações do Agendamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
        <CardFooter>
          <AppointmentFormActions isSubmitting={isSubmitting} />
        </CardFooter>
      </form>
    </Card>
  );
};

export default AppointmentForm;
