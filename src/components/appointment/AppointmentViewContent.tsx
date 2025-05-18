
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Appointment, FinancialRecord, AppointmentType, Client } from '@/services/types';
import AppointmentDetails from './AppointmentDetails';
import AppointmentFinancialRecords from './AppointmentFinancialRecords';
import AppointmentForm from './AppointmentForm';

interface AppointmentViewContentProps {
  appointment: Appointment;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
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
  statusLoading: boolean;
  relatedRecords: FinancialRecord[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStatusChange: (status: string) => void;
  onDeleteAppointment: () => void;
}

const AppointmentViewContent: React.FC<AppointmentViewContentProps> = ({
  appointment,
  isEditing,
  setIsEditing,
  clients,
  appointmentTypes,
  formData,
  isSubmitting,
  statusLoading,
  relatedRecords,
  onInputChange,
  onSelectChange,
  onDateChange,
  onSubmit,
  onStatusChange,
  onDeleteAppointment
}) => {
  return (
    <Tabs value={isEditing ? "edit" : "view"}>
      <TabsContent value="view" className="space-y-6 mt-0">
        <AppointmentDetails 
          appointment={appointment}
          onStatusChange={onStatusChange}
          statusLoading={statusLoading}
          hasFinancialRecords={relatedRecords.length > 0}
          onDeleteAppointment={onDeleteAppointment}
        />

        <AppointmentFinancialRecords records={relatedRecords} />
      </TabsContent>
      
      <TabsContent value="edit" className="space-y-6 mt-0">
        <AppointmentForm
          clients={clients}
          appointmentTypes={appointmentTypes}
          formData={formData}
          isSubmitting={isSubmitting}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
          onDateChange={onDateChange}
          onSubmit={onSubmit}
        />       

      </TabsContent>
    </Tabs>
  );
};

export default AppointmentViewContent;
