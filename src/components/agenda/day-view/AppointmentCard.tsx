
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '@/services/mockData';
import { AppointmentDetails } from './AppointmentDetails';
import { AppointmentActions } from './AppointmentActions';

interface AppointmentCardProps {
  appointment: Appointment;
  formatTime: (time: string) => string;
  getLocationText: (location: string) => string;
  renderStatusButton: (appointment: Appointment) => JSX.Element | null;
  sendWhatsAppReminder: (appointment: Appointment) => void;
  navigateToFinancialRecord: (appointment: Appointment) => void;
}

export const AppointmentCard = ({
  appointment,
  formatTime,
  getLocationText,
  renderStatusButton,
  sendWhatsAppReminder,
  navigateToFinancialRecord
}: AppointmentCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/agenda/${appointment.id}`);
  };

  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/agenda/${id}`);
  };

  return (
    <Card 
      key={appointment.id} 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <AppointmentDetails
            time={appointment.time}
            duration={appointment.duration}
            clientName={appointment.clientName}
            location={appointment.location}
            type={appointment.type}
            formatTime={formatTime}
            getLocationText={getLocationText}
          />
          
          <AppointmentActions
            appointment={appointment}
            sendWhatsAppReminder={sendWhatsAppReminder}
            navigateToFinancialRecord={navigateToFinancialRecord}
            renderStatusButton={renderStatusButton}
            onEditClick={handleEditClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};
