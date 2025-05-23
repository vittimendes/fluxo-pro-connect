import { useState, useEffect, useCallback } from 'react';
import { clientRepository } from '@/repositories/clientRepository';
import { Client } from '@/services/types';
import { ClientFormData } from '@/types/forms';
import { useToast } from '@/hooks/use-toast';
import { validate, clientSchema } from '@/utils/validation';
import { ReactNode } from 'react';
import { getCurrentUserIdSync } from '@/services/utils';

export function useClientRepository() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientRepository.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const searchClients = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const data = await clientRepository.search(query);
      setClients(data);
      return data;
    } catch (error) {
      console.error('Error searching clients:', error);
      toast({
        title: "Erro ao buscar clientes",
        description: "Não foi possível realizar a busca.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getClientById = useCallback(async (id: string) => {
    try {
      return await clientRepository.getById(id);
    } catch (error) {
      console.error('Error getting client:', error);
      toast({
        title: "Erro ao carregar cliente",
        description: "Não foi possível carregar os dados do cliente.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const createClient = useCallback(async (formData: ClientFormData) => {
    const validation = validate(clientSchema, formData);
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
      await clientRepository.create({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        notes: formData.notes || '',
        birthdate: formData.birthdate ? formData.birthdate.toISOString().split('T')[0] : undefined,
        feedbackStatus: 'not_sent',
        userId: getCurrentUserIdSync(),
      });

      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso!",
      });

      await loadClients(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadClients]);

  const updateClient = useCallback(async (id: string, formData: ClientFormData) => {
    const validation = validate(clientSchema, formData);
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
      await clientRepository.update(id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        notes: formData.notes || '',
        birthdate: formData.birthdate ? formData.birthdate.toISOString().split('T')[0] : undefined,
      });

      toast({
        title: "Cliente atualizado",
        description: "O cliente foi atualizado com sucesso!",
      });

      await loadClients(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadClients]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const success = await clientRepository.delete(id);
      
      if (success) {
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso!",
        });
        
        await loadClients(); // Refresh the list
      } else {
        toast({
          title: "Erro ao excluir cliente",
          description: "Não foi possível encontrar o cliente para exclusão.",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadClients]);

  return {
    clients,
    loading,
    loadClients,
    searchClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
  };
}
