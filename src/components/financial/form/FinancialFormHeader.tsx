
import React from 'react';
import { Appointment } from '@/services/mockData';
import { CardTitle } from '@/components/ui/card';

interface FinancialFormHeaderProps {
  initialData: any | null;
  appointment: Appointment | null;
}

export const FinancialFormHeader: React.FC<FinancialFormHeaderProps> = ({ 
  initialData, 
  appointment 
}) => {
  return (
    <CardTitle>
      {initialData ? "Editar Registro Financeiro" : 
        (appointment ? `Registro para ${appointment.type} - ${appointment.clientName}` : "Informações do Registro")}
    </CardTitle>
  );
};
