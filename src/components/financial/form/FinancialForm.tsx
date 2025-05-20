
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Appointment } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

import { FinancialFormHeader } from './FinancialFormHeader';
import { FinancialTypeField } from './FinancialTypeField';
import { FinancialAmountField } from './FinancialAmountField';
import { FinancialDescriptionField } from './FinancialDescriptionField';
import { FinancialClientField } from './FinancialClientField';
import { FinancialDateField } from './FinancialDateField';
import { FinancialCategoryField } from './FinancialCategoryField';
import { FinancialFormActions } from './FinancialFormActions';

export interface FinancialRecordFormData {
  amount: string;
  description: string;
  date: Date;
  type: string;
  category: string;
  clientId: string;
  relatedAppointment: string;
}

interface FinancialFormProps {
  clients: Client[];
  appointment: Appointment | null;
  appointmentId: string | null;
  loading: boolean;
  initialData?: any; // For edit mode
  onSubmit: (formData: FinancialRecordFormData) => Promise<void>;
}

export const FinancialRecordForm = ({ 
  clients, 
  appointment, 
  appointmentId, 
  loading,
  initialData,
  onSubmit
}: FinancialFormProps) => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Erro no formulário",
          description: "Por favor, insira um valor válido.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(initialData ? `/financeiro/${initialData.id}` : '/financeiro');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <FinancialFormHeader initialData={initialData} appointment={appointment} />
        </CardHeader>
        <CardContent className="space-y-4">
          <FinancialTypeField 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange('type', value)} 
          />
          
          <FinancialAmountField 
            value={formData.amount} 
            onChange={handleAmountChange} 
          />
          
          <FinancialDescriptionField 
            value={formData.description} 
            onChange={handleInputChange} 
          />
          
          {/* Client selection - only show if not linked to appointment */}
          {!appointment && (
            <FinancialClientField
              clients={clients}
              value={formData.clientId}
              onValueChange={(value) => handleSelectChange('clientId', value)}
            />
          )}
          
          <FinancialDateField 
            date={formData.date} 
            onDateChange={handleDateChange} 
          />
          
          <FinancialCategoryField 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange('category', value)} 
          />
        </CardContent>
        <CardFooter>
          <FinancialFormActions 
            initialData={initialData} 
            isSubmitting={isSubmitting} 
            onCancel={handleCancel} 
          />
        </CardFooter>
      </form>
    </Card>
  );
};
