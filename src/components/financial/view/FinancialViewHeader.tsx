
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinancialViewHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className="gap-2 pl-1"
      onClick={() => navigate('/financeiro')}
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </Button>
  );
};
