
import { useState, useEffect } from 'react';
import { mockDataService, AppointmentType } from '@/services/mockData';
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

const AppointmentTypes = () => {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [typeName, setTypeName] = useState('');
  const [typeDescription, setTypeDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<AppointmentType | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointmentTypes = async () => {
      setLoading(true);
      try {
        const data = await mockDataService.getAppointmentTypes();
        setAppointmentTypes(data);
      } catch (error) {
        console.error('Error fetching appointment types:', error);
        toast({
          title: "Erro ao carregar tipos",
          description: "Não foi possível carregar os tipos de atendimento.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentTypes();
  }, [toast]);

  const startNewType = () => {
    setEditingId('new');
    setTypeName('');
    setTypeDescription('');
  };

  const startEditType = (type: AppointmentType) => {
    setEditingId(type.id);
    setTypeName(type.name);
    setTypeDescription(type.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTypeName('');
    setTypeDescription('');
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

    try {
      if (editingId === 'new') {
        // Add new type
        const newType = await mockDataService.addAppointmentType({
          name: typeName.trim(),
          description: typeDescription.trim() || undefined,
          userId: '', // Will be set by the service
        });
        setAppointmentTypes(prev => [...prev, newType]);
        toast({
          title: "Tipo adicionado",
          description: "Novo tipo de atendimento criado com sucesso.",
        });
      } else if (editingId) {
        // Update existing type
        const updatedType = await mockDataService.updateAppointmentType(editingId, {
          name: typeName.trim(),
          description: typeDescription.trim() || undefined,
        });
        setAppointmentTypes(prev => 
          prev.map(type => type.id === editingId ? updatedType : type)
        );
        toast({
          title: "Tipo atualizado",
          description: "Tipo de atendimento atualizado com sucesso.",
        });
      }
      
      // Reset form
      cancelEdit();
    } catch (error) {
      console.error('Error saving appointment type:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o tipo de atendimento.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!typeToDelete) return;
    
    try {
      const success = await mockDataService.deleteAppointmentType(typeToDelete.id);
      if (success) {
        setAppointmentTypes(prev => prev.filter(t => t.id !== typeToDelete.id));
        toast({
          title: "Tipo excluído",
          description: "O tipo de atendimento foi removido com sucesso.",
        });
      } else {
        throw new Error('Failed to delete appointment type');
      }
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Tipos de Atendimento</h2>
        <Button onClick={startNewType} size="sm" disabled={editingId !== null}>
          <Plus className="h-4 w-4 mr-1" /> Novo Tipo
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* New/Edit Form */}
          {editingId && (
            <Card className="border-2 border-primary-muted">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="typeName" className="block text-sm font-medium">
                    Nome
                  </label>
                  <Input
                    id="typeName"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    placeholder="Ex: Consulta Individual"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="typeDescription" className="block text-sm font-medium">
                    Descrição (opcional)
                  </label>
                  <Textarea
                    id="typeDescription"
                    value={typeDescription}
                    onChange={(e) => setTypeDescription(e.target.value)}
                    placeholder="Descrição ou detalhes adicionais"
                    rows={3}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                  <Button size="sm" onClick={saveType}>
                    <Save className="h-4 w-4 mr-1" /> Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* List of Appointment Types */}
          {appointmentTypes.length > 0 ? (
            appointmentTypes.map(type => (
              <Card key={type.id} className="hover:shadow-md transition-shadow">
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
                        disabled={editingId !== null}
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
                        disabled={editingId !== null}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum tipo de atendimento cadastrado.</p>
              <Button onClick={startNewType} className="mt-4" disabled={editingId !== null}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar Tipo
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o tipo de atendimento "{typeToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentTypes;
