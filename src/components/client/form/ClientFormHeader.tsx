
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientFormHeaderProps {
  isEditing: boolean;
}

export const ClientFormHeader = ({ isEditing }: ClientFormHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-2" 
        onClick={() => navigate('/clientes')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      </h2>
    </div>
  );
};
