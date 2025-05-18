
// @file ClientEmptyState.tsx
// Empty state component displayed when no clients are found.

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// @component ClientEmptyState component
const ClientEmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-10">
      <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
      <Button onClick={() => navigate('/clientes/novo')} className="mt-4">
        <Plus className="h-4 w-4 mr-1" /> Adicionar Cliente
      </Button>
    </div>
  );
};

export default ClientEmptyState;
