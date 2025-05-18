
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface FinancialSummaryHeaderProps {
  title?: string;
  description?: string;
}

export const FinancialSummaryHeader = ({ 
  title = "Resumo Financeiro",
  description = "Mês Atual" 
}: FinancialSummaryHeaderProps) => {
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          {title}
        </CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};
