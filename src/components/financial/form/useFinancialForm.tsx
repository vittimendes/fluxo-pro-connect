import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/services/mockData';

export interface FinancialRecordFormData {
  amount: string;
  description: string;
  date: Date;
  type: string;
  category: string;
  clientId: string;
  relatedAppointment: string;
}

export const useFinancialForm = (
  initialData: any | null,
  appointment: Appointment | null,
  appointmentId: string | null
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<FinancialRecordFormData>({
    amount: '',
    description: '',
    date: new Date(),
    type: 'income',
    category: '',
    clientId: '',
    relatedAppointment: appointmentId || '',
  });

  useEffect(() => {
    // If we have initialData (edit mode), populate the form
    if (initialData) {
      setFormData({
        amount: initialData.amount ? Math.abs(initialData.amount).toString() : '',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date) : new Date(),
        type: initialData.type || 'income',
        category: initialData.category || '',
        clientId: initialData.clientId || '',
        relatedAppointment: initialData.relatedAppointment || appointmentId || '',
      });
    }
    // If we have an appointment but no initialData, use appointment data
    else if (appointment) {
      setFormData(prev => ({ 
        ...prev, 
        clientId: appointment.clientId,
        description: `${appointment.type} - ${appointment.clientName}`,
        relatedAppointment: appointmentId || ''
      }));
    }
  }, [appointment, appointmentId, initialData]);

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

  const validateForm = () => {
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

  const handleSubmit = async (
    e: React.FormEvent, 
    onSubmit: (formData: FinancialRecordFormData) => Promise<boolean>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateForm()) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
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
