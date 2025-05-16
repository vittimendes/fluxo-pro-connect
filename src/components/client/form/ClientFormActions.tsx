
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientFormActionsProps {
  loading: boolean;
}

export const ClientFormActions = ({ loading }: ClientFormActionsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button 
        variant="outline" 
        type="button" 
        onClick={() => navigate('/clientes')}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : "Salvar"}
      </Button>
    </>
  );
};
