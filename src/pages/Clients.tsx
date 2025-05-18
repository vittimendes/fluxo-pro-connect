
// @file Clients.tsx
// Clients listing page that displays all clients, with search functionality
// and options to view, edit, or delete individual clients.

import { useState, useEffect } from 'react';
import { mockDataService, Client } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import ClientListHeader from '@/components/client/ClientListHeader';
import ClientSearchBar from '@/components/client/ClientSearchBar';
import ClientList from '@/components/client/ClientList';
import ClientDeleteDialog from '@/components/client/ClientDeleteDialog';

// @component Main Clients page component
const Clients = () => {
  // @section State management
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
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

  return (
    <div className="space-y-6">
      {/* @component Page header with title and add button */}
      <ClientListHeader />

      {/* @component Search input */}
      <ClientSearchBar searchQuery={searchQuery} onSearchChange={handleSearch} />

      {/* @component Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <ClientList clients={filteredClients} onDeleteClick={setClientToDelete} />
      )}

      {/* @component Delete confirmation dialog */}
      <ClientDeleteDialog 
        client={clientToDelete} 
        onClose={() => setClientToDelete(null)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
};

export default Clients;
