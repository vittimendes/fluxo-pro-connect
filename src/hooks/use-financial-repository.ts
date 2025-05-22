import { useState, useEffect, useCallback } from 'react';
import { financialRepository } from '@/repositories/financialRepository';
import { FinancialRecord } from '@/services/types';
import { FinancialRecordFormData } from '@/types/forms';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { validate, financialRecordSchema } from '@/utils/validation';
import { ReactNode } from 'react';
import { getCurrentUserId } from '@/services/utils';

export function useFinancialRepository() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await financialRepository.getAll();
      setRecords(data);
    } catch (error) {
      console.error('Error loading financial records:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os registros financeiros.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const getRecordById = useCallback(async (id: string) => {
    try {
      return await financialRepository.getById(id);
    } catch (error) {
      console.error('Error getting financial record:', error);
      toast({
        title: "Erro ao carregar registro",
        description: "Não foi possível carregar o registro financeiro.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const createRecord = useCallback(async (formData: FinancialRecordFormData) => {
    const validation = validate(financialRecordSchema, formData);
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
      const amount = parseFloat(formData.amount);
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : amount;
      await financialRepository.create({
        amount: finalAmount,
        description: formData.description,
        date: formattedDate,
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        relatedAppointment: formData.relatedAppointment,
        clientId: formData.clientId,
        userId: getCurrentUserId(),
      });
      toast({
        title: "Registro criado",
        description: "O registro financeiro foi criado com sucesso!",
      });
      await loadRecords();
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
  }, [toast, loadRecords]);

  const updateRecord = useCallback(async (id: string, formData: FinancialRecordFormData) => {
    const validation = validate(financialRecordSchema, formData);
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
      const amount = parseFloat(formData.amount);
      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : amount;
      await financialRepository.update(id, {
        amount: finalAmount,
        description: formData.description,
        date: formattedDate,
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        relatedAppointment: formData.relatedAppointment,
        clientId: formData.clientId,
      });
      toast({
        title: "Registro atualizado",
        description: "O registro financeiro foi atualizado com sucesso!",
      });
      await loadRecords();
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
  }, [toast, loadRecords]);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      const success = await financialRepository.delete(id);
      if (success) {
        toast({
          title: "Registro excluído",
          description: "O registro financeiro foi excluído com sucesso!",
        });
        await loadRecords();
      } else {
        toast({
          title: "Erro ao excluir registro",
          description: "Não foi possível encontrar o registro para exclusão.",
          variant: "destructive",
        });
      }
      return success;
    } catch (error) {
      console.error('Error deleting financial record:', error);
      toast({
        title: "Erro ao excluir registro",
        description: "Não foi possível excluir o registro financeiro. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadRecords]);

  return {
    records,
    loading,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
  };
}
