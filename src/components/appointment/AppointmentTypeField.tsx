
import { AppointmentType } from '@/services/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentTypeFieldProps {
  appointmentTypes: AppointmentType[];
  value: string;
  onChange: (type: string) => void;
}

const AppointmentTypeField = ({ appointmentTypes, value, onChange }: AppointmentTypeFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Tipo de Atendimento</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um tipo" />
        </SelectTrigger>
        <SelectContent>
          {appointmentTypes.map(type => (
            <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AppointmentTypeField;
