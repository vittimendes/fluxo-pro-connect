
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ClientFormHeaderProps {
  isEditing: boolean;
}

export const ClientFormHeader = ({ isEditing }: ClientFormHeaderProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBack = () => {
    // Se estiver editando, volta para a página de detalhes do cliente
    if (isEditing && id) {
      navigate(`/clientes/${id}`);
    } else {
      // Caso contrário, volta para a lista de clientes
      navigate('/clientes');
    }
  };

  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-2" 
        onClick={handleBack}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      </h2>
    </div>
  );
};
