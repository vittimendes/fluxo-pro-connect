import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { clientRepository } from '@/repositories/clientRepository';
import { appointmentRepository } from '@/repositories/appointmentRepository';
import { financialRepository } from '@/repositories/financialRepository';
import { useToast } from '@/hooks/use-toast';
import { FinancialRecordFormData } from '@/types/forms';
import { Client, Appointment } from '@/services/types';

export const useFinancialRecord = (appointmentId: string | null) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch clients
        const clientsData = await clientRepository.getAll();
        setClients(clientsData);

        // If we have an appointmentId, fetch that appointment
        if (appointmentId) {
          const foundAppointment = await appointmentRepository.getById(appointmentId);
          if (foundAppointment) {
            setAppointment(foundAppointment);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados necessários.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentId, toast]);

  const submitFinancialRecord = async (formData: FinancialRecordFormData) => {
    try {
      const amount = parseFloat(formData.amount);
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : amount;
      await financialRepository.create({
        amount: finalAmount,
        description: formData.description,
        date: formattedDate,
        type: formData.type as 'income' | 'expense',
        category: formData.category || undefined,
        relatedAppointment: formData.relatedAppointment || undefined,
        clientId: formData.clientId || undefined,
        userId: '' // Will be set by repository
      });
      toast({
        title: "Registro criado",
        description: "O registro financeiro foi criado com sucesso!",
      });
      return true;
    } catch (error) {
      console.error('Error creating financial record:', error);
      toast({
        title: "Erro ao criar registro",
        description: "Não foi possível criar o registro financeiro. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateFinancialRecord = async (id: string, formData: FinancialRecordFormData) => {
    try {
      const amount = parseFloat(formData.amount);
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : amount;
      await financialRepository.update(id, {
        amount: finalAmount,
        description: formData.description,
        date: formattedDate,
        type: formData.type as 'income' | 'expense',
        category: formData.category || undefined,
        relatedAppointment: formData.relatedAppointment || undefined,
        clientId: formData.clientId || undefined,
      });
      toast({
        title: "Registro atualizado",
        description: "O registro financeiro foi atualizado com sucesso!",
      });
      return true;
    } catch (error) {
      console.error('Error updating financial record:', error);
      toast({
        title: "Erro ao atualizar registro",
        description: "Não foi possível atualizar o registro financeiro. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    clients,
    appointment,
    loading,
    submitFinancialRecord,
    updateFinancialRecord
  };
};
