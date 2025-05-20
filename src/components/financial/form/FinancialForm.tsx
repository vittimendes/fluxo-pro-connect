
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Appointment } from '@/services/mockData';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

import { FinancialFormHeader } from './FinancialFormHeader';
import { FinancialTypeField } from './FinancialTypeField';
import { FinancialAmountField } from './FinancialAmountField';
import { FinancialDescriptionField } from './FinancialDescriptionField';
import { FinancialClientField } from './FinancialClientField';
import { FinancialDateField } from './FinancialDateField';
import { FinancialCategoryField } from './FinancialCategoryField';
import { FinancialFormActions } from './FinancialFormActions';
import { LoadingSpinner } from './LoadingSpinner';
import { useFinancialForm, FinancialRecordFormData } from './useFinancialForm';

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
  
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleAmountChange,
    handleSubmit
  } = useFinancialForm(initialData, appointment, appointmentId);

  const handleCancel = () => {
    navigate(initialData ? `/financeiro/${initialData.id}` : '/financeiro');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
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
