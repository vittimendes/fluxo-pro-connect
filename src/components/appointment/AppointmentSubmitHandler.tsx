
import { useState } from 'react';
import { AppointmentFormData } from '@/types/forms';
import { useAppointmentRepository } from '@/hooks/use-appointment-repository';

interface AppointmentSubmitHandlerProps {
  formData: AppointmentFormData;
  children: (props: {
    isSubmitting: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => React.ReactNode;
}

export const AppointmentSubmitHandler: React.FC<AppointmentSubmitHandlerProps> = ({
  formData,
  children
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAppointment } = useAppointmentRepository();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await createAppointment(formData);
      
      if (success) {
        // Navigate or reset form could be done here
        console.log('Appointment created successfully');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <>{children({ isSubmitting, handleSubmit })}</>;
};
