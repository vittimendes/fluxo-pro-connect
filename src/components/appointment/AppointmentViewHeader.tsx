
// @file AppointmentViewHeader.tsx
// Header component for the appointment details page with navigation and action buttons.

import { Button } from '@/components/ui/button';
import BackToAgendaButton from './BackToAgendaButton';

// @component AppointmentViewHeader props definition
interface AppointmentViewHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
}

// @component Header with navigation and edit button
const AppointmentViewHeader = ({ isEditing, onEditClick }: AppointmentViewHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <BackToAgendaButton />
      
      {!isEditing && (
        <Button onClick={onEditClick}>
          Editar
        </Button>
      )}
    </div>
  );
};

export default AppointmentViewHeader;
