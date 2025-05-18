
// @file AppointmentViewHeader.tsx
// Header component for the appointment details page with navigation and action buttons.

import { Button } from '@/components/ui/button';
import BackToAgendaButton from './BackToAgendaButton';
import { Trash2, Edit } from 'lucide-react';

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
      <div className="flex items-center gap-2">
        {!isEditing && (
          <Button onClick={onEditClick}>
            <Edit className="h-4 w-4" />
            Editar          
          </Button>
        )}
            <Button 
              variant="outline" 
              size="sm"
              className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"              
            >
              <Trash2 className="h-4 w-4" />
            </Button>

        </div>    
    </div>    
  );
};

export default AppointmentViewHeader;
