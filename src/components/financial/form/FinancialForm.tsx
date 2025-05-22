import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Appointment } from '@/services/mockData';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { FinancialRecord } from '@/services/types';

import { FinancialFormHeader } from './FinancialFormHeader';
import { FinancialTypeField } from './FinancialTypeField';
import { FinancialAmountField } from './FinancialAmountField';
import { FinancialDescriptionField } from './FinancialDescriptionField';
import { FinancialClientField } from './FinancialClientField';
import { FinancialDateField } from './FinancialDateField';
import { FinancialCategoryField } from './FinancialCategoryField';
import { FinancialFormActions } from './FinancialFormActions';
import { LoadingSpinner } from './LoadingSpinner';
import { useFinancialForm, FinancialRecordFormData } from '@/hooks/financial/use-financial-form';

interface FinancialFormProps {
  clients: Client[];
  appointment: Appointment | null;
  appointmentId: string | null;
  loading: boolean;
  initialData?: FinancialRecord; // Use correct type
  onSubmit: (formData: FinancialRecordFormData) => Promise<boolean>;
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
    <Card aria-labelledby="financial-form-title">
      <form onSubmit={(e) => handleSubmit(e, onSubmit)} aria-describedby="financial-form-errors">
        <CardHeader>
          <FinancialFormHeader initialData={initialData} appointment={appointment} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div id="financial-form-errors" aria-live="polite" className="text-destructive text-sm min-h-[1.5em]" />
          <FinancialTypeField 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange('type', value)} 
            disabled={isSubmitting}
          />
          <FinancialAmountField 
            value={formData.amount} 
            onChange={handleAmountChange} 
            disabled={isSubmitting}
          />
          <FinancialDescriptionField 
            value={formData.description} 
            onChange={handleInputChange} 
            disabled={isSubmitting}
          />
          {/* Client selection - only show if not linked to appointment */}
          {!appointment && (
            <FinancialClientField
              clients={clients}
              value={formData.clientId}
              onValueChange={(value) => handleSelectChange('clientId', value)}
              disabled={isSubmitting}
              emptyStateText="Nenhum cliente cadastrado. Cadastre um cliente para registrar movimentações."
            />
          )}
          <FinancialDateField 
            date={formData.date} 
            onDateChange={handleDateChange} 
            disabled={isSubmitting}
          />
          <FinancialCategoryField 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange('category', value)} 
            disabled={isSubmitting}
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

