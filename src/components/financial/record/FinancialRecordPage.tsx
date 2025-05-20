
import React from 'react';
import { FinancialRecordPageHeader } from '@/components/financial/FinancialRecordPageHeader';
import { FinancialRecordForm } from '@/components/financial/form/FinancialForm';
import { Client, Appointment } from '@/services/mockData';
import { FinancialRecordFormData } from '@/types/forms';

interface FinancialRecordPageProps {
  title: string;
  clients: Client[];
  appointment: Appointment | null;
  appointmentId: string | null;
  loading: boolean;
  initialData?: any;
  onSubmit: (formData: FinancialRecordFormData) => Promise<boolean>;
}

export const FinancialRecordPage: React.FC<FinancialRecordPageProps> = ({
  title,
  clients,
  appointment,
  appointmentId,
  loading,
  initialData,
  onSubmit
}) => {
  return (
    <div className="space-y-6">
      <FinancialRecordPageHeader title={title} />
      <FinancialRecordForm
        clients={clients}
        appointment={appointment}
        appointmentId={appointmentId}
        loading={loading}
        initialData={initialData}
        onSubmit={onSubmit}
      />
    </div>
  );
};
