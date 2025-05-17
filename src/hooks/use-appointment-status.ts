
import { useState } from 'react';
import { mockDataService, Appointment } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { statusConfig } from '@/components/agenda/AgendaUtils';

export function useAppointmentStatus() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: string, status: string): Promise<void> => {
    try {
      const updatedAppointment = await mockDataService.updateAppointment(appointmentId, {
        status: status as 'scheduled' | 'confirmed' | 'canceled' | 'no_show' | 'completed'
      });
      
      // Update the local state to reflect the change
      setAppointments(prev => 
        prev.map(app => app.id === appointmentId ? updatedAppointment : app)
      );
      
      toast({
        title: "Status atualizado",
        description: `Status alterado para ${statusConfig[status].label}`,
      });
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
