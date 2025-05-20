
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FinancialRecordFormData } from '@/types/forms';

export function useFinancialValidation() {
  const { toast } = useToast();

  const validateForm = (formData: FinancialRecordFormData): boolean => {
    const amount = parseFloat(formData.amount);
      
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { validateForm };
}
