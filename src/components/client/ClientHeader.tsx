
import { Client } from '@/services/mockData';
import { User, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ClientHeaderProps {
  client: Client;
}

const ClientHeader = ({ client }: ClientHeaderProps) => {
  const navigate = useNavigate();
  
  const formatBirthdate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>{client.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          
          {client.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
          )}
          
          {client.birthdate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Nascimento: {formatBirthdate(client.birthdate)}</span>
            </div>
          )}
        </div>
        
        {client.notes && (
          <div className="pt-2 border-t">
            <span className="text-muted-foreground block mb-1">Observações:</span>
            <p className="text-sm">{client.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button 
          variant="outline"
          onClick={() => navigate(`/clientes/${client.id}/editar`)}
        >
          Editar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientHeader;
