
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        onClick={() => navigate('/agenda/novo')}
        className="flex items-center justify-center gap-2 py-6"
      >
        <Plus className="h-5 w-5" />
        <span>Novo Agendamento</span>
      </Button>
      <Button
        onClick={() => navigate('/financeiro/novo')}
        className="flex items-center justify-center gap-2 py-6"
        variant="outline"
      >
        <Plus className="h-5 w-5" />
        <span>Nova Receita</span>
      </Button>
    </div>
  );
};
