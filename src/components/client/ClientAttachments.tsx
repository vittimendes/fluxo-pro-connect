
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileIcon, ImageIcon, UploadIcon, XIcon, FileTextIcon, FileSpreadsheetIcon } from 'lucide-react';
import { usePremium } from '@/hooks/use-premium';
import PremiumOverlay from '@/components/PremiumOverlay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // For demo, this would be a blob URL
  appointmentId?: string;
  notes?: string;
  dateUploaded: Date;
}

interface ClientAttachmentsProps {
  clientId: string;
  appointments?: Array<{ id: string; date: string; type: string; }>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_FILE_TYPES = {
  'image/jpeg': { icon: ImageIcon, label: 'JPEG' },
  'image/png': { icon: ImageIcon, label: 'PNG' },
  'application/pdf': { icon: FileIcon, label: 'PDF' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileTextIcon, label: 'DOCX' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheetIcon, label: 'XLSX' },
};

export default function ClientAttachments({ clientId, appointments = [] }: ClientAttachmentsProps) {
  const { isPremium } = usePremium();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
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
  
  const handleUpload = () => {
    if (!newAttachment.file) {
      toast({
        title: "Selecione um arquivo",
        description: "É necessário selecionar um arquivo para fazer upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const file = newAttachment.file!;
      const url = URL.createObjectURL(file);
      
      const attachment: Attachment = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        appointmentId: newAttachment.appointmentId,
        notes: newAttachment.notes || undefined,
        dateUploaded: new Date()
      };
      
      setAttachments(prev => [...prev, attachment]);
      
      // Reset form
      setNewAttachment({ notes: '' });
      
      toast({
        title: "Arquivo anexado com sucesso",
        description: `${file.name} foi anexado ao cliente.`
      });
      
      setIsUploading(false);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 1000);
  };
  
  const handleRemove = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    
    toast({
      title: "Anexo removido",
      description: "O anexo foi removido com sucesso."
    });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const getFileIcon = (type: string) => {
    const fileType = Object.entries(ALLOWED_FILE_TYPES).find(([key]) => key === type);
    if (!fileType) return FileIcon;
    return fileType[1].icon;
  };
  
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Anexos</CardTitle>
        </CardHeader>
        <CardContent>
          <PremiumOverlay tooltipContent="Upload de anexos disponível no Plano Pro. Saiba mais nas configurações.">
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
          </PremiumOverlay>
        </CardContent>
      </Card>
      
      {/* Attachments list */}
      {attachments.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {attachments.map(attachment => {
            const FileIconComponent = getFileIcon(attachment.type);
            const isImage = attachment.type.startsWith('image/');
            
            return (
              <Card key={attachment.id} className="overflow-hidden">
                <div className="relative">
                  {isImage ? (
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src={attachment.url} 
                        alt={attachment.name} 
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <FileIconComponent className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => handleRemove(attachment.id)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm truncate" title={attachment.name}>
                      {attachment.name}
                    </h4>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(attachment.size)}</span>
                      <span>
                        {new Date(attachment.dateUploaded).toLocaleDateString()}
                      </span>
                    </div>
                    {attachment.notes && (
                      <p className="text-xs border-t pt-1 mt-1">{attachment.notes}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
