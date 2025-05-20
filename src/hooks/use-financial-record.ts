import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { mockDataService, Client, Appointment } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { FinancialRecordFormData } from '@/types/forms';

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
        const clientsData = await mockDataService.getClients();
        setClients(clientsData);

        // If we have an appointmentId, fetch that appointment
        if (appointmentId) {
          // For simplicity, we'll fetch all appointments and find the one we need
          // In a real app, we'd have a dedicated endpoint for this
          const appointments = await mockDataService.getAppointments();
          const foundAppointment = appointments.find(app => app.id === appointmentId);
          
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
      
      // For expenses, convert amount to negative value
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : amount;

      await mockDataService.addFinancialRecord({
        amount: finalAmount,
        description: formData.description,
        date: formattedDate,
        type: formData.type as 'income' | 'expense',
        category: formData.category || undefined,
        relatedAppointment: formData.relatedAppointment || undefined,
        clientId: formData.clientId || undefined,
        userId: '' // Adding required field (mockDataService will replace this)
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
      
      // For expenses, convert amount to negative value
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : amount;

      await mockDataService.updateFinancialRecord(id, {
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
