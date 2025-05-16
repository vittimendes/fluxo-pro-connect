
import { FileIcon } from 'lucide-react';
import AttachmentCard from './AttachmentCard';
import { Attachment } from '@/services/types';

interface AttachmentListProps {
  loading: boolean;
  attachments: Attachment[];
  onRemoveAttachment: (id: string) => void;
}

export default function AttachmentList({ loading, attachments, onRemoveAttachment }: AttachmentListProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // Empty state
  if (attachments.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
        <FileIcon className="mx-auto h-12 w-12 text-muted" />
        <h3 className="mt-2 text-sm font-medium">Nenhum anexo</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione um arquivo para este cliente usando o formulário acima.
        </p>
      </div>
    );
  }
  
  // Attachments grid
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {attachments.map(attachment => (
        <AttachmentCard
          key={attachment.id}
          attachment={attachment}
          onRemove={onRemoveAttachment}
        />
      ))}
    </div>
  );
}
