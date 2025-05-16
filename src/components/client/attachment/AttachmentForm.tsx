
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UploadIcon } from 'lucide-react';
import { attachmentService } from '@/services/attachmentService';

interface AttachmentFormProps {
  clientId: string;
  appointments?: Array<{ id: string; date: string; type: string; }>;
  onAttachmentAdded: (attachment: any) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
};

export default function AttachmentForm({ clientId, appointments = [], onAttachmentAdded }: AttachmentFormProps) {
  const { toast } = useToast();
  const [newAttachment, setNewAttachment] = useState<{
    file?: File;
    appointmentId?: string;
    notes: string;
  }>({
    notes: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive"
      });
      e.target.value = '';
      return;
    }
    
    // Check file type
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      toast({
        title: "Tipo de arquivo não permitido",
        description: "Apenas imagens (JPG, PNG) e documentos (PDF, DOCX, XLSX) são permitidos.",
        variant: "destructive"
      });
      e.target.value = '';
      return;
    }
    
    setNewAttachment(prev => ({ ...prev, file }));
  };
  
  const handleUpload = async () => {
    if (!newAttachment.file) {
      toast({
        title: "Selecione um arquivo",
        description: "É necessário selecionar um arquivo para fazer upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const file = newAttachment.file;
      
      // Create a blob URL for the file (in a real app, this would be an upload to a storage service)
      const url = URL.createObjectURL(file);
      
      // Add the attachment to the service
      const attachment = await attachmentService.addAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        clientId: clientId,
        appointmentId: newAttachment.appointmentId,
        notes: newAttachment.notes || undefined,
      });
      
      // Notify parent component
      onAttachmentAdded(attachment);
      
      // Reset form
      setNewAttachment({ notes: '' });
      
      toast({
        title: "Arquivo anexado com sucesso",
        description: `${file.name} foi anexado ao cliente.`
      });
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        title: "Erro ao anexar arquivo",
        description: "Não foi possível anexar o arquivo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="file-upload">Selecionar arquivo</Label>
          <Input 
            id="file-upload" 
            type="file" 
            accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Formatos permitidos: JPG, PNG, PDF, DOCX, XLSX. Tamanho máximo: 5MB.
          </p>
        </div>
        
        {appointments && appointments.length > 0 && (
          <div>
            <Label htmlFor="appointment">Atendimento relacionado (opcional)</Label>
            <Select
              value={newAttachment.appointmentId}
              onValueChange={value => setNewAttachment(prev => ({ ...prev, appointmentId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um atendimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum atendimento</SelectItem>
                {appointments.map(app => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.date} - {app.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div>
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Adicione informações sobre este arquivo..."
            value={newAttachment.notes}
            onChange={e => setNewAttachment(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleUpload}
        disabled={isUploading || !newAttachment.file}
        className="w-full"
      >
        {isUploading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"></span>
            Enviando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UploadIcon className="h-4 w-4" />
            Fazer upload
          </span>
        )}
      </Button>
    </div>
  );
}
