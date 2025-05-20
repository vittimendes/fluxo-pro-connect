
// @file Clients.tsx
// Clients listing page that displays all clients, with search functionality
// and options to view, edit, or delete individual clients.

import { useState, useEffect } from 'react';
import { Client } from '@/services/types';
import { useToast } from '@/hooks/use-toast';
import ClientListHeader from '@/components/client/ClientListHeader';
import ClientSearchBar from '@/components/client/ClientSearchBar';
import ClientList from '@/components/client/ClientList';
import ClientDeleteDialog from '@/components/client/ClientDeleteDialog';
import { useClientRepository } from '@/hooks/use-client-repository';

// @component Main Clients page component
const Clients = () => {
  // @section State management
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const { toast } = useToast();
  const { clients, loading, searchClients, deleteClient } = useClientRepository();

  // @effect Filter clients based on search query
  useEffect(() => {
    const fetchFilteredClients = async () => {
      if (searchQuery.trim() === '') {
        setFilteredClients(clients);
      } else {
        const results = await searchClients(searchQuery);
        setFilteredClients(results);
      }
    };

    fetchFilteredClients();
  }, [searchQuery, clients, searchClients]);

  // @function Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // @function Delete client after confirmation
  const confirmDelete = async () => {
    if (!clientToDelete) return;
    await deleteClient(clientToDelete.id);
    setClientToDelete(null);
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
