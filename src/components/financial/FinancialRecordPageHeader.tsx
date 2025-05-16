
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinancialRecordPageHeaderProps {
  title: string;
}

export const FinancialRecordPageHeader = ({ title }: FinancialRecordPageHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-2" 
        onClick={() => navigate('/financeiro')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        {title}
      </h2>
    </div>
  );
};
