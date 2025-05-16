
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AppointmentFormHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-2" 
        onClick={() => navigate('/agenda')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        Novo Agendamento
      </h2>
    </div>
  );
};

export default AppointmentFormHeader;
