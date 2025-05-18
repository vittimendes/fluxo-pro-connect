
// @file ClientList.tsx
// Component for displaying the list of clients.

import { Client } from '@/services/types';
import ClientCard from './ClientCard';
import ClientEmptyState from './ClientEmptyState';

// @component ClientList props definition
interface ClientListProps {
  clients: Client[];
  onDeleteClick: (client: Client) => void;
}

// @component List of client cards
const ClientList = ({ clients, onDeleteClick }: ClientListProps) => {
  if (clients.length === 0) {
    return <ClientEmptyState />;
  }

  return (
    <div className="space-y-4">
      {clients.map(client => (
        <ClientCard
          key={client.id}
          client={client}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default ClientList;
