
import { Appointment } from '@/services/mockData';
import { FinancialRecordFormData } from '@/types/forms';
import { useFinancialFormState } from './use-financial-form-state';
import { useFinancialFormHandlers } from './use-financial-form-handlers';
import { useFinancialFormSubmission } from './use-financial-form-submission';

export const useFinancialForm = (
  initialData: any | null,
  appointment: Appointment | null,
  appointmentId: string | null
) => {
  const { formData, setFormData } = useFinancialFormState(initialData, appointment, appointmentId);
  const { handleInputChange, handleSelectChange, handleDateChange, handleAmountChange } = 
    useFinancialFormHandlers(formData, setFormData);
  const { isSubmitting, handleSubmit: submitHandler } = useFinancialFormSubmission();

  const handleSubmit = (
    e: React.FormEvent, 
    onSubmit: (formData: FinancialRecordFormData) => Promise<boolean>
  ) => {
    return submitHandler(e, formData, onSubmit);
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleAmountChange,
    handleSubmit,
  };
};

export type { FinancialRecordFormData } from '@/types/forms';
