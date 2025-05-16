
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePremium } from '@/hooks/use-premium';
import PremiumOverlay from '@/components/PremiumOverlay';
import { useToast } from '@/hooks/use-toast';
import { Attachment } from '@/services/types';
import { attachmentService } from '@/services/attachmentService';

// Import our new components
import AttachmentForm from './attachment/AttachmentForm';
import AttachmentList from './attachment/AttachmentList';

interface ClientAttachmentsProps {
  clientId: string;
  appointments?: Array<{ id: string; date: string; type: string; }>;
}

export default function ClientAttachments({ clientId, appointments = [] }: ClientAttachmentsProps) {
  const { isPremium } = usePremium();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load attachments when the component mounts or clientId changes
  useEffect(() => {
    const loadAttachments = async () => {
      setLoading(true);
      try {
        const data = await attachmentService.getAttachmentsByClientId(clientId);
        setAttachments(data);
      } catch (error) {
        console.error('Error loading attachments:', error);
        toast({
          title: "Erro ao carregar anexos",
          description: "Não foi possível carregar os anexos do cliente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAttachments();
  }, [clientId, toast]);
  
  const handleAttachmentAdded = useCallback((attachment: Attachment) => {
    setAttachments(prev => [...prev, attachment]);
  }, []);
  
  const handleRemoveAttachment = useCallback(async (id: string) => {
    try {
      const success = await attachmentService.deleteAttachment(id);
      
      if (success) {
        setAttachments(prev => prev.filter(a => a.id !== id));
        
        toast({
          title: "Anexo removido",
          description: "O anexo foi removido com sucesso."
        });
      } else {
        throw new Error("Failed to delete attachment");
      }
    } catch (error) {
      console.error('Error removing attachment:', error);
      toast({
        title: "Erro ao remover anexo",
        description: "Não foi possível remover o anexo. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Anexos</CardTitle>
        </CardHeader>
        <CardContent>
          <PremiumOverlay tooltipContent="Upload de anexos disponível no Plano Pro. Saiba mais nas configurações.">
            <AttachmentForm 
              clientId={clientId} 
              appointments={appointments}
              onAttachmentAdded={handleAttachmentAdded}
            />
          </PremiumOverlay>
        </CardContent>
      </Card>
      
      <AttachmentList
        loading={loading}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
      />
    </div>
  );
}
