
import { useState } from 'react';
import { mockDataService, Appointment } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { statusConfig } from '@/components/agenda/AgendaUtils';

export function useAppointmentStatus(
  initialAppointments: Appointment[] = [],
  setParentAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>
) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const { toast } = useToast();

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: string, status: string): Promise<void> => {
    try {
      const updatedAppointment = await mockDataService.updateAppointment(appointmentId, {
        status: status as 'scheduled' | 'confirmed' | 'canceled' | 'no_show' | 'completed'
      });
      
      // Update the local appointments state
      const updatedAppointments = appointments.map(app => 
        app.id === appointmentId ? updatedAppointment : app
      );
      
      // Update both internal state and parent state if provided
      setAppointments(updatedAppointments);
      if (setParentAppointments) {
        setParentAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app.id === appointmentId ? updatedAppointment : app
          )
        );
      }
      
      // We removed the toast from here since it's now handled directly in the dropdown component
      // for a more immediate visual feedback
      
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    appointments,
    setAppointments,
    updateAppointmentStatus
  };
}
