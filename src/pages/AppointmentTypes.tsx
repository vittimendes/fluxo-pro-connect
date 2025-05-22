import { useState, useRef } from 'react';
import { useAppointmentTypeRepository } from '@/hooks/use-appointment-type-repository';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2,
  Tag,
  Save,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppointmentType } from '@/services/types';

const AppointmentTypes = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [typeName, setTypeName] = useState('');
  const [typeDescription, setTypeDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<AppointmentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const novoTipoBtnRef = useRef<HTMLButtonElement>(null);
  
  const { toast } = useToast();
  const { appointmentTypes, loading, createAppointmentType, updateAppointmentType, deleteAppointmentType } = useAppointmentTypeRepository();

  const startNewType = () => {
    setEditingId('new');
    setTypeName('');
    setTypeDescription('');
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const startEditType = (type: AppointmentType) => {
    setEditingId(type.id);
    setTypeName(type.name);
    setTypeDescription(type.description || '');
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTypeName('');
    setTypeDescription('');
    setTimeout(() => novoTipoBtnRef.current?.focus(), 100);
  };

  const saveType = async () => {
    if (!typeName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O tipo de atendimento precisa ter um nome.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId === 'new') {
        await createAppointmentType({
          name: typeName.trim(),
          description: typeDescription.trim() || undefined,
          userId: '',
        });
        toast({
          title: 'Tipo criado',
          description: 'O tipo de atendimento foi criado com sucesso.'
        });
      } else if (editingId) {
        await updateAppointmentType(editingId, {
          name: typeName.trim(),
          description: typeDescription.trim() || undefined,
        });
        toast({
          title: 'Tipo atualizado',
          description: 'O tipo de atendimento foi atualizado com sucesso.'
        });
      }
      cancelEdit();
    } catch (error) {
      console.error('Error saving appointment type:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o tipo de atendimento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!typeToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteAppointmentType(typeToDelete.id);
      toast({
        title: 'Tipo excluído',
        description: 'O tipo de atendimento foi excluído com sucesso.'
      });
    } catch (error) {
      console.error('Error deleting appointment type:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o tipo de atendimento.",
        variant: "destructive",
      });
    } finally {
      setTypeToDelete(null);
      setIsDialogOpen(false);
      setIsSubmitting(false);
      setTimeout(() => novoTipoBtnRef.current?.focus(), 100);
    }
  };

  return (
    <div className="space-y-6" aria-labelledby="appointment-types-title">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary" id="appointment-types-title">Tipos de Atendimento</h2>
        <Button ref={novoTipoBtnRef} onClick={startNewType} size="sm" disabled={editingId !== null || loading} aria-label="Adicionar novo tipo de atendimento">
          <Plus className="h-4 w-4 mr-1" /> Novo Tipo
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16" aria-busy="true" aria-live="polite">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* New/Edit Form */}
          {editingId && (
            <Card className="border-2 border-primary-muted" role="form" aria-labelledby="edit-type-title">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="typeName" className="block text-sm font-medium">Nome</label>
                  <Input
                    id="typeName"
                    ref={nameInputRef}
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    placeholder="Ex: Consulta Individual"
                    aria-required="true"
                    aria-label="Nome do tipo de atendimento"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="typeDescription" className="block text-sm font-medium">Descrição (opcional)</label>
                  <Textarea
                    id="typeDescription"
                    value={typeDescription}
                    onChange={(e) => setTypeDescription(e.target.value)}
                    placeholder="Descrição ou detalhes adicionais"
                    rows={3}
                    className="resize-none"
                    aria-label="Descrição do tipo de atendimento"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={cancelEdit} disabled={isSubmitting} aria-label="Cancelar edição">
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                  <Button size="sm" onClick={saveType} disabled={isSubmitting} aria-label="Salvar tipo de atendimento">
                    <Save className="h-4 w-4 mr-1" /> {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* List of Appointment Types */}
          {appointmentTypes.length > 0 ? (
            appointmentTypes.map(type => (
              <Card key={type.id} className="hover:shadow-md transition-shadow" role="listitem">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{type.name}</h3>
                        {type.description && (
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEditType(type)}
                        disabled={editingId !== null || isSubmitting}
                        aria-label={`Editar tipo ${type.name}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setTypeToDelete(type);
                          setIsDialogOpen(true);
                        }}
                        disabled={editingId !== null || isSubmitting}
                        aria-label={`Excluir tipo ${type.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10" aria-live="polite">
              <span className="block text-2xl mb-2" role="img" aria-label="Nenhum tipo">🏷️</span>
              <p className="text-muted-foreground">Nenhum tipo de atendimento cadastrado.</p>
              <Button onClick={startNewType} className="mt-4" disabled={editingId !== null || loading} aria-label="Adicionar tipo de atendimento">
                <Plus className="h-4 w-4 mr-1" /> Adicionar Tipo
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent role="alertdialog" aria-modal="true" aria-labelledby="dialog-title">
          <DialogHeader>
            <DialogTitle id="dialog-title">Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o tipo de atendimento "{typeToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentTypes;
