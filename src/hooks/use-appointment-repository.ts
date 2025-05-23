
import { useState, useEffect, ReactNode, useCallback } from 'react';
import { supabaseAppointmentRepository } from '@/repositories/supabase/appointmentRepository';
import { Appointment } from '@/services/types';
import { AppointmentFormData } from '@/types/forms';
import { useToast } from '@/hooks/use-toast';
import { validate, appointmentSchema } from '@/utils/validation';

// Type for valid appointment status values
type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';

export function useAppointmentRepository() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    try {
      const data = await supabaseAppointmentRepository.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const getAppointmentsByDate = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const data = await supabaseAppointmentRepository.getByDate(date);
      return data;
    } catch (error) {
      console.error('Error getting appointments by date:', error);
      toast({
        title: "Erro ao buscar agendamentos",
        description: "Não foi possível buscar os agendamentos pela data.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getAppointmentsByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    setLoading(true);
    try {
      const data = await supabaseAppointmentRepository.getByDateRange(startDate, endDate);
      return data;
    } catch (error) {
      console.error('Error getting appointments by date range:', error);
      toast({
        title: "Erro ao buscar agendamentos",
        description: "Não foi possível buscar os agendamentos pelo período.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  async function getAppointmentById(id: string) {
    try {
      return await supabaseAppointmentRepository.getById(id);
    } catch (error) {
      console.error('Error getting appointment:', error);
      toast({
        title: "Erro ao carregar agendamento",
        description: "Não foi possível carregar os dados do agendamento.",
        variant: "destructive",
      });
      return null;
    }
  }

  async function createAppointment(formData: AppointmentFormData) {
    const validation = validate(appointmentSchema, formData);
    if (!validation.success) {
      if ('errors' in validation) {
        Object.entries(validation.errors).forEach(([field, message]) => {
          toast({
            title: `Erro no campo ${field}`,
            description: message as ReactNode,
            variant: "destructive",
          });
        });
      }
      return false;
    }

    try {
      await supabaseAppointmentRepository.create(formData);

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso!",
      });

      await loadAppointments(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }

  async function updateAppointment(id: string, formData: AppointmentFormData) {
    const validation = validate(appointmentSchema, formData);
    if (!validation.success) {
      if ('errors' in validation) {
        Object.entries(validation.errors).forEach(([field, message]) => {
          toast({
            title: `Erro no campo ${field}`,
            description: message as ReactNode,
            variant: "destructive",
          });
        });
      }
      return false;
    }

    try {
      await supabaseAppointmentRepository.update(id, formData);

      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso!",
      });

      await loadAppointments(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erro ao atualizar agendamento",
        description: "Não foi possível atualizar o agendamento. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }

  async function deleteAppointment(id: string) {
    try {
      const success = await supabaseAppointmentRepository.delete(id);
      
      if (success) {
        toast({
          title: "Agendamento excluído",
          description: "O agendamento foi excluído com sucesso!",
        });
        
        await loadAppointments(); // Refresh the list
      } else {
        toast({
          title: "Erro ao excluir agendamento",
          description: "Não foi possível encontrar o agendamento para exclusão.",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erro ao excluir agendamento",
        description: "Não foi possível excluir o agendamento. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }

  async function updateAppointmentStatus(id: string, status: string) {
    try {
      await supabaseAppointmentRepository.update(id, { 
        status: status as AppointmentStatus // Cast to specific type
      });
      
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso!",
      });
      
      await loadAppointments(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
      return false;
    }
  }

  return {
    appointments,
    loading,
    getAppointmentsByDate,
    getAppointmentsByDateRange,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    loadAppointments
  };
}
