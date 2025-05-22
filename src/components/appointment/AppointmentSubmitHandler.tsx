import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await createAppointment(formData);
      
      if (success) {
        navigate('/agenda'); // Redirect to agenda after successful creation
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <>{children({ isSubmitting, handleSubmit })}</>;
};
