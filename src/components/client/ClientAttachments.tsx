import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePremium } from '@/hooks/use-premium';
import PremiumOverlay from '@/components/PremiumOverlay';
import { useToast } from '@/hooks/use-toast';
import { Attachment } from '@/services/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAttachmentRepository } from '@/hooks/use-attachment-repository';

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
  const [showForm, setShowForm] = useState(false);
  const novoAnexoBtnRef = useRef<HTMLButtonElement>(null);
  const attachmentsEndRef = useRef<HTMLDivElement>(null);
  const {
    attachments,
    loading,
    loadAttachments,
    addAttachment,
    removeAttachment,
  } = useAttachmentRepository(clientId);

  // Load attachments when the component mounts or clientId changes
  useEffect(() => {
    loadAttachments();
  }, [clientId, loadAttachments]);

  // Scroll to the end of the attachments list after adding
  useEffect(() => {
    if (attachmentsEndRef.current) {
      attachmentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [attachments.length]);

  const handleAttachmentAdded = useCallback(async (attachmentData) => {
    await addAttachment(attachmentData);
    setShowForm(false);
    toast({
      title: 'Arquivo anexado',
      description: 'O arquivo foi anexado com sucesso.',
    });
    setTimeout(() => {
      novoAnexoBtnRef.current?.focus();
    }, 300);
  }, [addAttachment, toast]);

  const handleRemoveAttachment = useCallback(async (id: string) => {
    await removeAttachment(id);
    toast({
      title: 'Anexo removido',
      description: 'O anexo foi removido com sucesso.',
    });
  }, [removeAttachment, toast]);

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium" id="attachments-heading">Anexos do Cliente</h3>
        <PremiumOverlay tooltipContent="Upload de anexos disponível no Plano Pro. Saiba mais nas configurações.">
          <Button 
            ref={novoAnexoBtnRef}
            aria-label="Adicionar novo anexo"
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
        <Card role="dialog" aria-modal="true" aria-labelledby="add-attachment-title">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg" id="add-attachment-title">Adicionar Anexo</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                aria-label="Cancelar adição de anexo"
                onClick={() => {
                  setShowForm(false);
                  setTimeout(() => {
                    novoAnexoBtnRef.current?.focus();
                  }, 100);
                }}
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
      {attachments.length === 0 && !loading ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed" aria-live="polite">
          <span className="block text-2xl mb-2" role="img" aria-label="Nenhum anexo">📎</span>
          <h3 className="mt-2 text-sm font-medium">Nenhum anexo</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione um arquivo para este cliente usando o botão acima.
          </p>
        </div>
      ) : (
        <>
          <AttachmentList
            loading={loading}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
          />
          <div ref={attachmentsEndRef} tabIndex={-1} aria-hidden="true" />
        </>
      )}
    </div>
  );
};
