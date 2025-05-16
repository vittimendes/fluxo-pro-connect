
import { Client } from '@/services/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentClientFieldProps {
  clients: Client[];
  value: string;
  onChange: (clientId: string) => void;
}

const AppointmentClientField = ({ clients, value, onChange }: AppointmentClientFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="clientId">Cliente</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um cliente" />
        </SelectTrigger>
        <SelectContent>
          {clients.map(client => (
            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppointmentClientField;
