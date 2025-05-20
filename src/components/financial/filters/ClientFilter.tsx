
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from '@/services/types';
import { clientService } from '@/services/clientService';

interface ClientFilterProps {
  selectedClientId: string | null;
  onClientChange: (clientId: string | null) => void;
}

export const ClientFilter = ({
  selectedClientId,
  onClientChange,
}: ClientFilterProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await clientService.getClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientChange = (value: string) => {
    if (value === 'all') {
      onClientChange(null);
    } else if (value === 'no-client') {
      onClientChange('no-client');
    } else {
      onClientChange(value);
    }
  };

  return (
    <Select 
      value={selectedClientId === 'no-client' ? 'no-client' : selectedClientId || 'all'} 
      onValueChange={handleClientChange}
      disabled={loading}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <SelectValue placeholder="Selecione um cliente" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os registros</SelectItem>
        <SelectItem value="no-client">Sem cliente associado</SelectItem>
        {clients.map(client => (
          <SelectItem key={client.id} value={client.id}>
            {client.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
