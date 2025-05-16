
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileIcon, ImageIcon, XIcon, FileTextIcon, FileSpreadsheetIcon } from 'lucide-react';

interface AttachmentCardProps {
  attachment: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    dateUploaded?: string;
    notes?: string;
  };
  onRemove: (id: string) => void;
}

export default function AttachmentCard({ attachment, onRemove }: AttachmentCardProps) {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type === 'application/pdf') return FileIcon;
    if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return FileTextIcon;
    if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return FileSpreadsheetIcon;
    return FileIcon;
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const isImage = attachment.type.startsWith('image/');
  const FileIconComponent = getFileIcon(attachment.type);

  return (
    <Card className="overflow-hidden">
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
          onClick={() => onRemove(attachment.id)}
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
              {attachment.dateUploaded ? new Date(attachment.dateUploaded).toLocaleDateString() : ''}
            </span>
          </div>
          {attachment.notes && (
            <p className="text-xs border-t pt-1 mt-1">{attachment.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
