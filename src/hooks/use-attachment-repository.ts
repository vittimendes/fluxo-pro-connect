import { useState, useCallback } from 'react';
import { attachmentRepository } from '@/repositories/attachmentRepository';
import { Attachment } from '@/services/types';
import { useToast } from '@/hooks/use-toast';

export function useAttachmentRepository(clientId: string) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadAttachments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await attachmentRepository.getByClientId(clientId);
      setAttachments(data);
    } catch (error) {
      console.error('Error loading attachments:', error);
      toast({
        title: 'Erro ao carregar anexos',
        description: 'Não foi possível carregar os anexos do cliente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, toast]);

  const addAttachment = useCallback(async (item: Omit<Attachment, 'id' | 'userId' | 'dateUploaded'>) => {
    try {
      const attachment = await attachmentRepository.create(item);
      setAttachments(prev => [...prev, attachment]);
      toast({
        title: 'Arquivo anexado com sucesso',
        description: `${attachment.name} foi anexado ao cliente.`,
      });
      return attachment;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        title: 'Erro ao anexar arquivo',
        description: 'Não foi possível anexar o arquivo. Tente novamente.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const removeAttachment = useCallback(async (id: string) => {
    try {
      const success = await attachmentRepository.delete(id);
      if (success) {
        setAttachments(prev => prev.filter(a => a.id !== id));
        toast({
          title: 'Anexo removido',
          description: 'O anexo foi removido com sucesso.',
        });
      } else {
        throw new Error('Failed to delete attachment');
      }
      return success;
    } catch (error) {
      console.error('Error removing attachment:', error);
      toast({
        title: 'Erro ao remover anexo',
        description: 'Não foi possível remover o anexo. Tente novamente.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  return {
    attachments,
    loading,
    loadAttachments,
    addAttachment,
    removeAttachment,
  };
}
