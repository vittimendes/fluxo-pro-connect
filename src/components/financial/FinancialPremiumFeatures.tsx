
import { FileText, Download } from 'lucide-react';
import { PremiumButton } from '@/components/PremiumFeature';

export const FinancialPremiumFeatures = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <PremiumButton variant="outline" size="sm">
        <FileText className="h-3 w-3 mr-1" /> Gerar Relatório
      </PremiumButton>
      
      <PremiumButton variant="outline" size="sm">
        <Download className="h-3 w-3 mr-1" /> Exportar CSV
      </PremiumButton>
      
      <PremiumButton variant="outline" size="sm">
        <FileText className="h-3 w-3 mr-1" /> Controle de Recibos
      </PremiumButton>
    </div>
  );
};
