
import { useState } from 'react';
import { FinancialRecordFormData } from '@/types/forms';
import { useFinancialValidation } from './use-financial-validation';

export function useFinancialFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateForm } = useFinancialValidation();

  const handleSubmit = async (
    e: React.FormEvent, 
    formData: FinancialRecordFormData,
    onSubmit: (formData: FinancialRecordFormData) => Promise<boolean>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateForm(formData)) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
}
