
import { useState, useEffect } from 'react';
import { Appointment } from '@/services/mockData';
import { FinancialRecordFormData } from '@/types/forms';

export function useFinancialFormState(
  initialData: any | null,
  appointment: Appointment | null,
  appointmentId: string | null
) {
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

  return { formData, setFormData };
}
