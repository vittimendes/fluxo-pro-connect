// @file use-appointment-status.ts
// Custom React hook for managing appointment status updates
// with local state synchronization and API integration.

import { useState } from 'react';
import { Appointment } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { statusConfig } from '@/components/agenda/AgendaUtils';
import { useAppointmentRepository } from './use-appointment-repository';

// @function Custom hook for appointment status management
export function useAppointmentStatus(
  initialAppointments: Appointment[] = [],
  setParentAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>
) {
  // @section State management
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const { toast } = useToast();
  const { updateAppointmentStatus: repoUpdateAppointmentStatus, loadAppointments } = useAppointmentRepository();

  // @api Update appointment status and synchronize state
  const updateAppointmentStatus = async (appointmentId: string, status: string): Promise<void> => {
    try {
      // Use repository to update appointment status
      const success = await repoUpdateAppointmentStatus(appointmentId, status);
      if (!success) throw new Error('Repository failed to update status');
      // Optionally reload appointments from repository if needed
      await loadAppointments();
      // Optionally update local state if you want to keep it in sync
      setAppointments(prev => prev.map(app =>
        app.id === appointmentId ? { ...app, status: status as Appointment['status'] } : app
      ));
      if (setParentAppointments) {
        setParentAppointments(prevAppointments =>
          prevAppointments.map(app =>
            app.id === appointmentId ? { ...app, status: status as Appointment['status'] } : app
          )
        );
      }
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
