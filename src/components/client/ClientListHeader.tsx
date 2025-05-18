
// @file ClientListHeader.tsx
// Header component for the clients page with title and add client button.

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// @component ClientListHeader component
const ClientListHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight text-primary">Clientes</h2>
      <Button onClick={() => navigate('/clientes/novo')} size="sm">
        <Plus className="h-4 w-4 mr-1" /> Novo Cliente
      </Button>
    </div>
  );
};

export default ClientListHeader;
