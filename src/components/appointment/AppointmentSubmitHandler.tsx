
// @file AppointmentSubmitHandler.tsx
// Component to handle appointment form submissions

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { mockDataService } from '@/services/mockData';
import { format } from 'date-fns';
import { getCurrentUserId } from '@/services/utils';

// @types Component props
interface AppointmentSubmitHandlerProps {
  formData: {
    clientId: string;
    clientName: string;
    type: string;
    date: Date;
    time: string;
    duration: string;
    location: string;
    notes: string;
    status: string;
  };
  children: (props: {
    isSubmitting: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => React.ReactNode;
}

// @component Appointment submit handler
export const AppointmentSubmitHandler: React.FC<AppointmentSubmitHandlerProps> = ({ 
  formData, 
  children 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // @handler Submit appointment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.clientId || !formData.type) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, selecione um cliente e um tipo de atendimento.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const dateStr = format(formData.date, 'yyyy-MM-dd');
      
      await mockDataService.addAppointment({
        clientId: formData.clientId,
        clientName: formData.clientName,
        type: formData.type,
        date: dateStr,
        time: formData.time,
        duration: parseInt(formData.duration),
        location: formData.location as 'online' | 'in_person' | 'home_visit',
        status: formData.status as 'scheduled' | 'confirmed' | 'canceled' | 'no_show' | 'completed',
        notes: formData.notes,
        userId: getCurrentUserId()
      });

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso!",
      });

      // Redirect back to agenda page
      navigate('/agenda');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // @render Provide submit handler to children
  return (
    <>
      {children({
        isSubmitting,
        handleSubmit
      })}
    </>
  );
};
