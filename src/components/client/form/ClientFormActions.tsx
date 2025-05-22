
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ClientFormActionsProps {
  loading: boolean;
  isEditing?: boolean;
}

export const ClientFormActions = ({ loading, isEditing = false }: ClientFormActionsProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleCancel = () => {
    // Se estiver editando, volta para a página de detalhes do cliente
    if (isEditing && id) {
      navigate(`/clientes/${id}`);
    } else {
      // Caso contrário, volta para a lista de clientes
      navigate('/clientes');
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        type="button" 
        onClick={handleCancel}
        disabled={loading}
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
            {isEditing ? 'Atualizando...' : 'Salvando...'}
          </>
        ) : isEditing ? 'Salvar alterações' : 'Cadastrar cliente'}
      </Button>
    </>
  );
};
