import { useState, useEffect } from 'react';
import { appointmentTypeRepository } from '@/repositories/appointmentTypeRepository';
import { AppointmentType } from '@/services/types';
import { useToast } from '@/hooks/use-toast';

export function useAppointmentTypeRepository() {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAppointmentTypes();
  }, []);

  async function loadAppointmentTypes() {
    setLoading(true);
    try {
      const data = await appointmentTypeRepository.getAll();
      setAppointmentTypes(data);
    } catch (error) {
      console.error('Error loading appointment types:', error);
      toast({
        title: 'Erro ao carregar tipos',
        description: 'Não foi possível carregar os tipos de atendimento.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function createAppointmentType(type: Omit<AppointmentType, 'id'>) {
    try {
      await appointmentTypeRepository.create(type);
      await loadAppointmentTypes();
      toast({
        title: 'Tipo adicionado',
        description: 'Novo tipo de atendimento criado com sucesso.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Erro ao adicionar tipo',
        description: 'Não foi possível adicionar o tipo de atendimento.',
        variant: 'destructive',
      });
      return false;
    }
  }

  async function updateAppointmentType(id: string, data: Partial<AppointmentType>) {
    try {
      await appointmentTypeRepository.update(id, data);
      await loadAppointmentTypes();
      toast({
        title: 'Tipo atualizado',
        description: 'Tipo de atendimento atualizado com sucesso.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Erro ao atualizar tipo',
        description: 'Não foi possível atualizar o tipo de atendimento.',
        variant: 'destructive',
      });
      return false;
    }
  }

  async function deleteAppointmentType(id: string) {
    try {
      await appointmentTypeRepository.delete(id);
      await loadAppointmentTypes();
      toast({
        title: 'Tipo excluído',
        description: 'O tipo de atendimento foi removido com sucesso.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Erro ao excluir tipo',
        description: 'Não foi possível excluir o tipo de atendimento.',
        variant: 'destructive',
      });
      return false;
    }
  }

  return {
    appointmentTypes,
    loading,
    createAppointmentType,
    updateAppointmentType,
    deleteAppointmentType,
    loadAppointmentTypes,
  };
}
