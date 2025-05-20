
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

interface FinancialFormActionsProps {
  initialData: any | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FinancialFormActions: React.FC<FinancialFormActionsProps> = ({ 
  initialData, 
  isSubmitting, 
  onCancel 
}) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : initialData ? "Atualizar" : "Salvar"}
      </Button>
    </div>
  );
};
