
// @file ClientCard.tsx
// Individual client card component displaying client information with action buttons.

import { useNavigate } from 'react-router-dom';
import { Client } from '@/services/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Cake, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// @component ClientCard props definition
interface ClientCardProps {
  client: Client;
  onDeleteClick: (client: Client) => void;
}

// @component Client card showing client details and actions
const ClientCard = ({ client, onDeleteClick }: ClientCardProps) => {
  const navigate = useNavigate();

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

  // @function Handle click on client card
  const handleCardClick = (e: React.MouseEvent) => {
    // Check if the click was on a button inside the card
    const target = e.target as HTMLElement;
    const isButton = target.closest('button');
    
    if (!isButton) {
      // If not clicking a button, navigate to client details
      navigate(`/clientes/${client.id}`);
    }
  };

  return (
    <Card 
      key={client.id} 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
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
              onClick={() => onDeleteClick(client)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
