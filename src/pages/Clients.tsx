
// @file Clients.tsx
// Clients listing page that displays all clients, with search functionality
// and options to view, edit, or delete individual clients.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDataService, Client } from '@/services/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Trash2, Edit, Phone, Mail, Cake } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Clients = () => {
  // @section State management
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // @effect Load all clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        // @api Fetch clients data
        const data = await mockDataService.getClients();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        // @event Handle data fetching error
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

  // @effect Filter clients based on search query
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

  // @function Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // @function Delete client after confirmation
  const confirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      // @api Delete client
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
      // @event Handle client deletion error
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
  
  // @function Handle click on client card
  const handleCardClick = (client: Client, e: React.MouseEvent) => {
    // Check if the click was on a button inside the card
    const target = e.target as HTMLElement;
    const isButton = target.closest('button');
    
    if (!isButton) {
      // If not clicking a button, navigate to client details
      navigate(`/clientes/${client.id}`);
    }
  };

  // @utility Format birthdate for display
  const formatBirthdate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = parseISO(dateStr);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* @component Page header with title and add button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Clientes</h2>
        <Button onClick={() => navigate('/clientes/novo')} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Novo Cliente
        </Button>
      </div>

      {/* @component Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* @component Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* @component List of client cards */}
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
                      {client.birthdate && (
                        <div className="flex items-center text-muted-foreground">
                          <Cake className="h-3 w-3 mr-1" />
                          <span className="text-sm">{formatBirthdate(client.birthdate)}</span>
                        </div>
                      )}
                      {client.notes && (
                        <p className="text-sm mt-2 text-muted-foreground">
                          {client.notes}
                        </p>
                      )}
                    </div>
                    
                    {/* @component Client card action buttons */}
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

      {/* @component Delete confirmation dialog */}
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
