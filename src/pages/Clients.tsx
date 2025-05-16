import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDataService, Client } from '@/services/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Trash2, Edit, Phone, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await mockDataService.getClients();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        client => 
          client.name.toLowerCase().includes(query) || 
          client.phone.includes(query) ||
          (client.email && client.email.toLowerCase().includes(query))
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      const success = await mockDataService.deleteClient(clientToDelete.id);
      if (success) {
        setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
        toast({
          title: "Cliente excluído",
          description: "O cliente foi removido com sucesso.",
        });
      } else {
        throw new Error('Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente.",
        variant: "destructive",
      });
    } finally {
      setClientToDelete(null);
    }
  };
  
  const handleCardClick = (client: Client, e: React.MouseEvent) => {
    // Check if the click was on a button inside the card
    const target = e.target as HTMLElement;
    const isButton = target.closest('button');
    
    if (!isButton) {
      // If not clicking a button, navigate to client details
      navigate(`/clientes/${client.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Clientes</h2>
        <Button onClick={() => navigate('/clientes/novo')} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Novo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <Card 
                key={client.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={(e) => handleCardClick(client, e)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold text-lg flex items-center">
                        {client.name}
                      </h3>
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-3 w-3 mr-1" />
                        <span className="text-sm">{client.phone}</span>
                      </div>
                      {client.email && (
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                      )}
                      {client.notes && (
                        <p className="text-sm mt-2 text-muted-foreground">
                          {client.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/clientes/${client.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setClientToDelete(client)}
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
              <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
              <Button onClick={() => navigate('/clientes/novo')} className="mt-4">
                <Plus className="h-4 w-4 mr-1" /> Adicionar Cliente
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cliente {clientToDelete?.name}? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
