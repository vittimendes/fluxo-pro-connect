
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinancialHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight text-primary">Financeiro</h2>
      <Button onClick={() => navigate('/financeiro/novo')}>
        <Plus className="h-4 w-4 mr-1" /> 
        <span className="hidden sm:inline">Novo Registro</span>
      </Button>
    </div>
  );
};
