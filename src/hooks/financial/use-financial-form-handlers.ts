
import { FinancialRecordFormData } from '@/types/forms';

export function useFinancialFormHandlers(
  formData: FinancialRecordFormData, 
  setFormData: React.Dispatch<React.SetStateAction<FinancialRecordFormData>>
) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) setFormData(prev => ({ ...prev, date }));
  };

  const handleAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, amount: value }));
  };

  return {
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleAmountChange
  };
}
