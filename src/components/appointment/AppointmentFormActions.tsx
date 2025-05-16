
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface AppointmentFormActionsProps {
  isSubmitting: boolean;
}

const AppointmentFormActions = ({ isSubmitting }: AppointmentFormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        type="button" 
        onClick={() => navigate('/agenda')}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : "Salvar"}
      </Button>
    </div>
  );
};

export default AppointmentFormActions;
