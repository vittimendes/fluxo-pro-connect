
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentStatusFieldProps {
  status: string;
  onChange: (status: string) => void;
}

const AppointmentStatusField = ({ status, onChange }: AppointmentStatusFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Select 
        value={status} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="scheduled">Agendado</SelectItem>
          <SelectItem value="confirmed">Confirmado</SelectItem>
          <SelectItem value="canceled">Cancelado</SelectItem>
          <SelectItem value="no_show">Não Compareceu</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppointmentStatusField;
