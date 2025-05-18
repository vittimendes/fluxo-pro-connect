
// @file ClientDeleteDialog.tsx
// Confirmation dialog for deleting a client.

import { Client } from '@/services/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// @component ClientDeleteDialog props definition
interface ClientDeleteDialogProps {
  client: Client | null;
  onClose: () => void;
  onConfirm: () => void;
}

// @component Confirmation dialog for client deletion
const ClientDeleteDialog = ({ client, onClose, onConfirm }: ClientDeleteDialogProps) => {
  if (!client) return null;
  
  return (
    <Dialog open={!!client} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o cliente {client.name}? 
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDeleteDialog;
