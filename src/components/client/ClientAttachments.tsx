
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePremium } from '@/hooks/use-premium';
import PremiumOverlay from '@/components/PremiumOverlay';
import { useToast } from '@/hooks/use-toast';
import { Attachment } from '@/services/types';
import { attachmentService } from '@/services/attachmentService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Import our components
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
  const [showForm, setShowForm] = useState(false);
  
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
    setShowForm(false); // Hide form after successful upload
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Anexos do Cliente</h3>
        <PremiumOverlay tooltipContent="Upload de anexos disponível no Plano Pro. Saiba mais nas configurações.">
          <Button 
            onClick={() => setShowForm(true)} 
            size="sm"
            className="gap-1"
            disabled={showForm}
          >
            <Plus className="h-4 w-4" />
            Novo Anexo
          </Button>
        </PremiumOverlay>
      </div>
      
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Adicionar Anexo</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
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
      )}
      
      <AttachmentList
        loading={loading}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
      />
    </div>
  );
};
